import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import React from "react";
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
import CartSummaryInfo, {
  ICartInfoTableRow,
} from "@/components/Cart/CartSummaryInfo";
import CartMethodSummaryInfoRow from "@/components/Cart/Methods/CartMethodSummaryInfoRow";
import { cartPaymentMethodAPI } from "@/pages/api/cart/[token]/payment-method";
import { cartShippingMethodAPI } from "@/pages/api/cart/[token]/shipping-method";

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

  const getCountryName = (countryId: string) =>
    countries.find((c) => c.code == countryId)?.name || "";

  const shippingInfoRows: ICartInfoTableRow[] = [
    {
      label: "First name",
      value: shippingInfo.first_name,
    },
    {
      label: "Surname",
      value: shippingInfo.surname,
    },
    {
      label: "Email",
      value: shippingInfo.email,
    },
    {
      label: "Phone",
      value: shippingInfo.phone,
    },
    {
      label: "Street",
      value: shippingInfo.street,
    },
    {
      label: "Additional info",
      value: shippingInfo.additional_info,
    },
    {
      label: "City",
      value: shippingInfo.city,
    },
    {
      label: "Postal code",
      value: shippingInfo.postal_code,
    },
    {
      label: "Country",
      value: getCountryName(shippingInfo.country),
    },
  ];

  const billingInfoRows: ICartInfoTableRow[] = [
    {
      label: "First name",
      value: billingInfo.first_name,
    },
    {
      label: "Surname",
      value: billingInfo.surname,
    },
    {
      label: "Company name",
      value: billingInfo.company_name,
    },
    {
      label: "Company ID",
      value: billingInfo.company_id,
    },
    {
      label: "VAT ID",
      value: billingInfo.vat_number,
    },
    {
      label: "Street",
      value: billingInfo.street,
    },
    {
      label: "City",
      value: billingInfo.city,
    },
    {
      label: "Postal code",
      value: billingInfo.postal_code,
    },
    {
      label: "Country",
      value: getCountryName(billingInfo.country),
    },
  ];

  return (
    <div className="container">
      <CartStepper activeStep={3} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" sx={{ my: 3 }}>
            Items
          </Typography>
          <CartItemList editable={false} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ ml: 5 }}>
            <Typography variant="h5" sx={{ my: 3 }}>
              Shipping &amp; payment method
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
          <Typography variant="h5" sx={{ my: 3 }}>
            Shipping Info
          </Typography>
          <CartSummaryInfo rows={shippingInfoRows} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h5" sx={{ my: 3 }}>
            Billing Info
          </Typography>
          <CartSummaryInfo rows={billingInfoRows} />
        </Grid>
      </Grid>
      <CartButtonRow
        prev={{
          title: "Previous",
          onClick: () => {
            router.push("/cart/step/2");
          },
          disabled: false,
        }}
        next={{
          title: "Next",
          onClick: () => {},
          disabled: true,
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
