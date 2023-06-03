import DashboardLayout from "@/pages/dashboard/layout";
import Container from "@mui/material/Container";
import React, { ReactElement } from "react";
import RootLayout from "@/pages/layout";
import { NextApiRequest, NextApiResponse } from "next";
import { orderDetailAPI } from "@/pages/api/order/[id]";
import { IOrderDetail } from "@/types/order";
import OrderDetailWrapper from "@/components/Dashboard/Order/Detail/OrderDetailWrapper";
import { cartBillingInfoAPI } from "@/pages/api/cart/[token]/billing-info";
import { cartShippingInfoAPI } from "@/pages/api/cart/[token]/shipping-info";
import { IBillingInfo, IShippingInfo } from "@/types/cart/cart";
import { ICountryBase } from "@/types/country";
import { countryListAPI } from "@/pages/api/country";
import { paymentMethodCountryDetailAPI } from "@/pages/api/cart/payment-method/country/[payment_country_id]";
import {
  ITranslatedPaymentMethodCountryBase,
  ITranslatedShippingMethodCountryBase,
} from "@/types/cart/methods";
import { shippingMethodCountryDetailAPI } from "@/pages/api/cart/shipping-method/country/[shipping_country_id]";

interface IOrderDetailPageProps {
  order: IOrderDetail;
  billingInfo: IBillingInfo;
  shippingInfo: IShippingInfo;
  countryOptions: ICountryBase[];
  paymentMethodCountry: ITranslatedPaymentMethodCountryBase | null;
  shippingMethodCountry: ITranslatedShippingMethodCountryBase | null;
}

const OrderDetailPage = ({
  order,
  billingInfo,
  shippingInfo,
  countryOptions,
  paymentMethodCountry,
  shippingMethodCountry,
}: IOrderDetailPageProps) => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <OrderDetailWrapper
          order={order}
          billingInfo={billingInfo}
          shippingInfo={shippingInfo}
          countryOptions={countryOptions}
          paymentMethodCountry={paymentMethodCountry}
          shippingMethodCountry={shippingMethodCountry}
        />
      </Container>
    </DashboardLayout>
  );
};

OrderDetailPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps = async (context: any) => {
  const { req, res } = context;
  const { id } = context.params;

  const order: IOrderDetail = await orderDetailAPI(
    "GET",
    id,
    req as NextApiRequest,
    res as NextApiResponse
  );

  const billingInfo = await cartBillingInfoAPI(
    "GET",
    order.cart.token,
    req as NextApiRequest,
    res as NextApiResponse
  );

  const shippingInfo = await cartShippingInfoAPI(
    "GET",
    order.cart.token,
    req as NextApiRequest,
    res as NextApiResponse
  );

  const countryOptions = await countryListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  const paymentMethodCountry = order.cart.payment_method_country
    ? await paymentMethodCountryDetailAPI(
        "GET",
        order.cart.payment_method_country,
        req as NextApiRequest,
        res as NextApiResponse
      )
    : null;

  const shippingMethodCountry = order.cart.shipping_method_country
    ? await shippingMethodCountryDetailAPI(
        "GET",
        order.cart.shipping_method_country,
        req as NextApiRequest,
        res as NextApiResponse
      )
    : null;

  return {
    props: {
      order,
      billingInfo,
      shippingInfo,
      countryOptions,
      paymentMethodCountry,
      shippingMethodCountry,
    },
  };
};

export default OrderDetailPage;
