// next
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";

// react
import React, { useCallback, useEffect, useMemo, useState } from "react";

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
  IShippingMethodCountry,
} from "@/types/cart";
import { countryListAPI } from "@/pages/api/country";
import { ICountry } from "@/types/country";
import CartButtonRow from "@/components/Cart/ButtonRow";
import { cartAPI } from "@/pages/api/cart";
import { cartDetailAPI } from "@/pages/api/cart/[token]/detail";
import { cartShippingPaymentMethodsAPI } from "@/pages/api/cart/methods/[country]";
import PaymentMethodList from "@/components/Cart/Methods/PaymentMethodList";
import { setPaymentMethod, setShippingMethod } from "@/api/cart/methods";
import CartItemList from "@/components/Cart/CartItemList";
import CartSummaryInfo, {
  ICartInfoTableRow,
} from "@/components/Cart/CartSummaryInfo";

interface ICartSummaryPageProps {
  billingInfo: IBillingInfo;
  shippingInfo: IShippingInfo;
  countries: ICountry[];
}

/**
 * Cart summary page displaying all the items, addresses and shipping & payment method
 */
const CartSummaryPage = ({
  billingInfo,
  shippingInfo,
  countries,
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
          <Typography variant="h4" sx={{ my: 3 }}>
            Order summary
          </Typography>
          <CartItemList editable={false} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h5" sx={{ my: 3 }}>
            Shipping &amp; payment method
          </Typography>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  /**
   * Fetch the cart from the API
   */

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

  return {
    props: {
      billingInfo,
      shippingInfo,
      countries,
    },
  };
};

export default CartSummaryPage;
