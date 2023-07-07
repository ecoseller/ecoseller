import {
  IBillingInfo,
  ICart,
  IPaymentMethodCountry,
  IShippingInfo,
  IShippingMethodCountry,
} from "@/types/cart";
import { ICountry } from "@/types/country";
import { useTranslation } from "next-i18next";
import CartInfoSummary, {
  ICartInfoTableRow,
} from "@/components/Cart/CartInfoSummary";
import Grid from "@mui/material/Grid";
import { Box, Table, Typography } from "@mui/material";
import CartItemList from "@/components/Cart/CartItemList";
import CartMethodSummaryInfoRow from "@/components/Cart/Methods/CartMethodSummaryInfoRow";
import CollapsableContentWithTitle from "@/components/Generic/CollapsableContentWithTitle";
import React from "react";
import { useTheme } from "@mui/material/styles";
import CartCompleteOrder from "@/components/Cart/CartCompleteOrder";
import Divider from "@mui/material/Divider";

interface ICartOrderSummaryProps {
  cart: ICart;
  billingInfo: IBillingInfo;
  shippingInfo: IShippingInfo;
  countries: ICountry[];
  selectedPaymentMethod: IPaymentMethodCountry;
  selectedShippingMethod: IShippingMethodCountry;
  creatingNewOrder: boolean;
  addTitle?: boolean;
}

/**
 * Component displaying cart's summary
 * @param cart
 * @param billingInfo
 * @param shippingInfo
 * @param countries
 * @param selectedPaymentMethod
 * @param selectedShippingMethod
 * @param creatingNewOrder
 * @param addTitle
 * @constructor
 */
const CartOrderSummary = ({
  cart,
  billingInfo,
  shippingInfo,
  countries,
  selectedPaymentMethod,
  selectedShippingMethod,
  creatingNewOrder,
  addTitle = true,
}: ICartOrderSummaryProps) => {
  const theme = useTheme();
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
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        {addTitle ? (
          <Typography variant="h4" sx={{ my: 3 }}>
            {t("cart:summary-title") /* Order summary */}
          </Typography>
        ) : null}
        <CartItemList cart={cart} editable={false} />
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
        <CollapsableContentWithTitle
          title={t("cart:shipping-information-title")}
        >
          <CartInfoSummary rows={shippingInfoRows} />
        </CollapsableContentWithTitle>
      </Grid>
      <Grid item xs={12} md={4}>
        <CollapsableContentWithTitle
          title={t("cart:billing-information-title")}
        >
          <CartInfoSummary rows={billingInfoRows} />
        </CollapsableContentWithTitle>
      </Grid>
      <Grid item xs={12} md={8} textAlign="center">
        {creatingNewOrder ? (
          <CartCompleteOrder cart={cart} />
        ) : (
          <>
            <Divider />
            <Typography variant="h5" sx={{ my: 3 }}>
              {
                t("cart:total-price-incl-price", {
                  price: cart.total_price_incl_vat_formatted,
                }) /**Total price:&nbsp; */
              }
            </Typography>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default CartOrderSummary;
