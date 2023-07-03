// next
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import getConfig from "next/config";

// react
import { useCallback, useEffect, useMemo, useState } from "react";
// utils
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// api
import { putBillingInfo, putShippingInfo } from "@/api/cart/info";
import { cartBillingInfoAPI } from "@/pages/api/cart/[token]/billing-info";
import { cartShippingInfoAPI } from "@/pages/api/cart/[token]/shipping-info";

// components
import BillingInfoForm, {
  IBillingInfoFormProps,
  billingInfoInitialData,
  exportBillingInfo,
} from "@/components/Forms/BillingInfoForm";
import ShippingInfoForm, {
  IShippingInfoFormProps,
  exportShippingInfo,
  shippingInfoInitialData,
} from "@/components/Forms/ShippingInfoForm";
import CartStepper from "@/components/Cart/Stepper";
import ShippingMethodList from "@/components/Cart/Methods/ShippingMethodList";

// mui
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
// types
import {
  IBillingInfo,
  ICartDetail,
  IPaymentMethodCountry,
  IShippingInfo,
  IShippingMethodCountryWithPaymentMethod,
} from "@/types/cart";
import { countryListAPI } from "@/pages/api/country";
import { ICountry } from "@/types/country";
import CartButtonRow from "@/components/Cart/ButtonRow";
import { cartAPI } from "@/pages/api/cart";
import { cartDetailAPI } from "@/pages/api/cart/[token]/detail";
import { cartShippingPaymentMethodsAPI } from "@/pages/api/cart/methods/[country]";
import PaymentMethodList from "@/components/Cart/Methods/PaymentMethodList";
import { setPaymentMethod, setShippingMethod } from "@/api/cart/methods";

const { serverRuntimeConfig } = getConfig();

interface ICartStep2PageProps {
  cart: ICartDetail;
  methods: IShippingMethodCountryWithPaymentMethod[];
  cartToken: string;
}

const CartStep2Page = ({ cart, methods, cartToken }: ICartStep2PageProps) => {
  /**
   * Step 2 page of the cart consist of the:
   * - shipping method
   * - payment method
   */

  const router = useRouter();
  const { t } = useTranslation("cart");

  const [shippingMethodCountryId, setShippingMethodCountryId] = useState<
    number | null
  >(cart.shipping_method_country || null);

  const [paymentMethodCountryId, setPaymentMethodCountryId] = useState<
    number | null
  >(cart.payment_method_country || null);

  const submitForm = async () => {
    if (!shippingMethodCountryId || !paymentMethodCountryId) return;

    const shippingRes = await setShippingMethod(
      cartToken,
      shippingMethodCountryId
    );
    const paymentRes = await setPaymentMethod(
      cartToken,
      paymentMethodCountryId
    );

    if (shippingRes === 200 && paymentRes === 200) {
      router.push("/cart/summary");
    }
  };

  useEffect(() => {
    // if shipping method country changes, see if we have the same payment method
    // available for the new country. If not, reset the payment method
    if (!shippingMethodCountryId) {
      setPaymentMethodCountryId(null);
      return;
    }

    const paymentMethods = methods?.find(
      (method) => method.id === shippingMethodCountryId
    )?.payment_methods;

    if (
      paymentMethods?.find((method) => method.id === paymentMethodCountryId) ===
      undefined
    ) {
      setPaymentMethodCountryId(null);
    }
  }, [shippingMethodCountryId]);

  return (
    <div className="container">
      <CartStepper activeStep={2} />
      <Grid
        container
        spacing={{ xs: 0, md: 4, lg: 4 }}
        columns={{ xs: 10, sm: 10, md: 12 }}
        pt={4}
      >
        <Grid container item xs={10} sm={10} md={5} direction="column">
          <div className="shipping-info-form">
            <h2>{t("shipping-method-title") /* Shipping method */}</h2>
            <ShippingMethodList
              methods={methods}
              selected={shippingMethodCountryId}
              setSelected={setShippingMethodCountryId}
            />
          </div>
        </Grid>
        <Grid container item xs={10} sm={10} md={5} direction="column" pt={4}>
          <div className="billing-info-form">
            <h2>{t("payment-method-title") /* Payment method */}</h2>
            {shippingMethodCountryId === null ? (
              <p>
                {
                  t(
                    "choose-shipping-method-first"
                  ) /** Choose shipping method first*/
                }
              </p>
            ) : (
              <PaymentMethodList
                methods={
                  methods?.find(
                    (method) => method.id === shippingMethodCountryId
                  )?.payment_methods || []
                }
                selected={paymentMethodCountryId}
                setSelected={setPaymentMethodCountryId}
              />
            )}
          </div>
        </Grid>
      </Grid>
      <CartButtonRow
        prev={{
          title: "Previous",
          onClick: () => {
            router.push("/cart/step/1");
          },
          disabled: false,
        }}
        next={{
          title: "Next",
          onClick: async () => submitForm(),
          disabled: !shippingMethodCountryId || !paymentMethodCountryId,
        }}
      />
      <Box sx={{ height: "200px" }} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  /**
   * Fetch the cart from the API
   */

  const { req, res, locale } = context;
  const { cartToken } = req.cookies;

  if (cartToken === undefined || cartToken === null) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const cart = await cartDetailAPI(
    "GET",
    cartToken,
    req as NextApiRequest,
    res as NextApiResponse
  );

  if (cart === undefined || cart === null) {
    // if there's no cart, redirect to the homepage
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const country = cart.country;
  const methods = await cartShippingPaymentMethodsAPI(
    "GET",
    country,
    req as NextApiRequest,
    res as NextApiResponse
  );

  if (methods === undefined || methods === null || methods?.length === 0) {
    // if there's no cart, redirect to the homepage
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // get countries
  const countries = await countryListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      cart,
      methods,
      cartToken,
      ...(await serverSideTranslations(locale as string, [
        "cart",
        ...serverRuntimeConfig.commoni18NameSpaces,
      ])),
    },
  };
};

export default CartStep2Page;
