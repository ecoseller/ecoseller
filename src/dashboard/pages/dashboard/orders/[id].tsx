import DashboardLayout from "@/pages/dashboard/layout";
import Container from "@mui/material/Container";
import React, { ReactElement } from "react";
import RootLayout from "@/pages/layout";
import OrderDetailItemList from "@/components/Dashboard/Order/Detail/OrderDetailItemList";
import { NextApiRequest, NextApiResponse } from "next";
import { orderDetailAPI } from "@/pages/api/order/[id]";
import { IOrderDetail } from "@/types/order";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { OrderList } from "@/components/Dashboard/Order/List/OrderList";
import OrderDetailWrapper from "@/components/Dashboard/Order/Detail/OrderDetailWrapper";
import { cartBillingInfoAPI } from "@/pages/api/cart/[token]/billing-info";
import { cartShippingInfoAPI } from "@/pages/api/cart/[token]/shipping-info";
import { IBillingInfo, IShippingInfo } from "@/types/cart/cart";
import { ICountryBase } from "@/types/country";
import { countryListAPI } from "@/pages/api/country";

interface IOrderDetailPageProps {
  order: IOrderDetail;
  billingInfo: IBillingInfo;
  shippingInfo: IShippingInfo;
  countryOptions: ICountryBase[];
}

const OrderDetailPage = ({
  order,
  billingInfo,
  shippingInfo,
  countryOptions,
}: IOrderDetailPageProps) => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <OrderDetailWrapper
          order={order}
          billingInfo={billingInfo}
          shippingInfo={shippingInfo}
          countryOptions={countryOptions}
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
  
  const paymentMethod = order.cart.payment_method_country ? await  : null;

  return {
    props: {
      order,
      billingInfo,
      shippingInfo,
      countryOptions,
    },
  };
};

export default OrderDetailPage;
