import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import getConfig from "next/config";
import React from "react";
// utils
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { cartBillingInfoAPI } from "@/pages/api/cart/[token]/billing-info";
import { cartShippingInfoAPI } from "@/pages/api/cart/[token]/shipping-info";
import CartStepper from "@/components/Cart/Stepper";
import { Box, Table, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  IBillingInfo,
  ICart,
  IPaymentMethodCountry,
  IShippingInfo,
  IShippingMethodCountry,
} from "@/types/cart";
import { countryListAPI } from "@/pages/api/country";
import { ICountry } from "@/types/country";
import CartButtonRow from "@/components/Cart/ButtonRow";
import CartItemList from "@/components/Cart/CartItemList";
import CartInfoSummary, {
  ICartInfoTableRow,
} from "@/components/Cart/CartInfoSummary";
import CartMethodSummaryInfoRow from "@/components/Cart/Methods/CartMethodSummaryInfoRow";
import { cartPaymentMethodAPI } from "@/pages/api/cart/[token]/payment-method";
import { cartShippingMethodAPI } from "@/pages/api/cart/[token]/shipping-method";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { useCart } from "@/utils/context/cart";
import CollapsableContentWithTitle from "@/components/Generic/CollapsableContentWithTitle";
import CartCompleteOrder from "@/components/Cart/CartCompleteOrder";
import CartOrderSummary from "@/components/Cart/CartOrderSummary";
import { cartDetailAPI } from "@/pages/api/cart/[token]";

const { serverRuntimeConfig } = getConfig();

interface ICartSummaryPageProps {
  cart: ICart;
  billingInfo: IBillingInfo;
  shippingInfo: IShippingInfo;
  countries: ICountry[];
  selectedPaymentMethod: IPaymentMethodCountry;
  selectedShippingMethod: IShippingMethodCountry;
}

/**
 * Cart summary page displaying all the items, addresses and shipping & payment method
 */
const CartSummaryPage = ({
  cart,
  billingInfo,
  shippingInfo,
  countries,
  selectedPaymentMethod,
  selectedShippingMethod,
}: ICartSummaryPageProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="container">
      <CartStepper activeStep={3} />

      {cart ? (
        <CartOrderSummary
          cart={cart}
          billingInfo={billingInfo}
          shippingInfo={shippingInfo}
          countries={countries}
          selectedPaymentMethod={selectedPaymentMethod}
          selectedShippingMethod={selectedShippingMethod}
          creatingNewOrder={true}
        />
      ) : null}

      <CartButtonRow
        prev={{
          title: t("back") /* Back */,
          onClick: () => {
            router.push("/cart/step/2");
          },
          disabled: false,
        }}
      />
    </div>
  );
};

/**
 * Fetch the cart from the API
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
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

  const shippingInfo = await cartShippingInfoAPI(
    "GET",
    cartToken,
    req as NextApiRequest,
    res as NextApiResponse
  );

  const billingInfo = await cartBillingInfoAPI(
    "GET",
    cartToken,
    req as NextApiRequest,
    res as NextApiResponse
  );

  const countries = await countryListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  const selectedPaymentMethod = await cartPaymentMethodAPI(
    "GET",
    cartToken,
    req as NextApiRequest,
    res as NextApiResponse
  );

  const selectedShippingMethod = await cartShippingMethodAPI(
    "GET",
    cartToken,
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      cart,
      billingInfo,
      shippingInfo,
      countries,
      selectedPaymentMethod,
      selectedShippingMethod,
      ...(await serverSideTranslations(locale as string, [
        "cart",
        "order",
        ...serverRuntimeConfig.commoni18NameSpaces,
      ])),
    },
  };
};

export default CartSummaryPage;
