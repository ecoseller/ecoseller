import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import React from "react";
// utils
import { useTranslation } from "next-i18next";
import { cartBillingInfoAPI } from "@/pages/api/cart/[token]/billing-info";
import { cartShippingInfoAPI } from "@/pages/api/cart/[token]/shipping-info";
import CartStepper from "@/components/Cart/Stepper";
import { Box, Table, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  IBillingInfo,
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

interface ICartSummaryPageProps {
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
  billingInfo,
  shippingInfo,
  countries,
  selectedPaymentMethod,
  selectedShippingMethod,
}: ICartSummaryPageProps) => {
  const router = useRouter();
  const theme = useTheme();
  const { cart } = useCart();
  const { t } = useTranslation();

  const getCountryName = (countryId: string) =>
    countries.find((c) => c.code == countryId)?.name || "";

  const shippingInfoRows: ICartInfoTableRow[] = [
    {
      label: t("common:first-name-label"),
      value: shippingInfo.first_name,
    },
    {
      label: t("common:surname-label"),
      value: shippingInfo.surname,
    },
    {
      label: t("common:email-label"),
      value: shippingInfo.email,
    },
    {
      label: t("common:phone-label"),
      value: shippingInfo.phone,
    },
    {
      label: t("common:street-label"),
      value: shippingInfo.street,
    },
    {
      label: t("common:additional-info-label"),
      value: shippingInfo.additional_info,
    },
    {
      label: t("common:city-label"),
      value: shippingInfo.city,
    },
    {
      label: t("common:postal-code-label"),
      value: shippingInfo.postal_code,
    },
    {
      label: t("common:country-label"),
      value: getCountryName(shippingInfo.country),
    },
  ];

  const billingInfoRows: ICartInfoTableRow[] = [
    {
      label: t("common:first-name-label"),
      value: billingInfo.first_name,
    },
    {
      label: t("common:surname-label"),
      value: billingInfo.surname,
    },
    {
      label: t("common:company-name-label"),
      value: billingInfo.company_name,
    },
    {
      label: t("common:company-id-label"),
      value: billingInfo.company_id,
    },
    {
      label: t("common:vat-number-label"),
      value: billingInfo.vat_number,
    },
    {
      label: t("common:street-label"),
      value: billingInfo.street,
    },
    {
      label: t("common:additional-info-label"),
      value: billingInfo.city,
    },
    {
      label: t("common:postal-code-label"),
      value: billingInfo.postal_code,
    },
    {
      label: t("common:country-label"),
      value: getCountryName(billingInfo.country),
    },
  ];

  return (
    <div className="container">
      <CartStepper activeStep={3} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" sx={{ my: 3 }}>
            {t("cart:summary-title") /* Order summary */}
          </Typography>
          <CartItemList editable={false} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ [theme.breakpoints.up("md")]: { ml: 5 } }}>
            <Typography variant="h6" sx={{ my: 3 }}>
              {
                t(
                  "cart:shipping-and-payment-method-title"
                ) /* Shipping and payment method */
              }
            </Typography>
            <Table>
              <CartMethodSummaryInfoRow
                method={selectedShippingMethod.shipping_method}
                formattedPrice={selectedShippingMethod.price_incl_vat}
              />
              <CartMethodSummaryInfoRow
                method={selectedPaymentMethod.payment_method}
                formattedPrice={selectedPaymentMethod.price_incl_vat}
              />
            </Table>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <CollapsableContentWithTitle title="Shipping info">
            <CartInfoSummary rows={shippingInfoRows} />
          </CollapsableContentWithTitle>
        </Grid>
        <Grid item xs={12} md={4}>
          <CollapsableContentWithTitle title="Billing info">
            <CartInfoSummary rows={billingInfoRows} />
          </CollapsableContentWithTitle>
        </Grid>

        {cart ? (
          <Grid item xs={12} md={8} textAlign="center">
            <CartCompleteOrder cart={cart} />
          </Grid>
        ) : null}
      </Grid>
      <CartButtonRow
        prev={{
          title: "Previous",
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
  const { req, res } = context;
  const { cartToken } = req.cookies;

  if (cartToken === undefined || cartToken === null) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

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
      billingInfo,
      shippingInfo,
      countries,
      selectedPaymentMethod,
      selectedShippingMethod,
    },
  };
};

export default CartSummaryPage;
