import DashboardLayout from "@/pages/dashboard/layout";
import React, { ReactElement } from "react";
import RootLayout from "@/pages/layout";
import Container from "@mui/material/Container";
import { NextApiRequest, NextApiResponse } from "next";
import { orderAPI } from "@/pages/api/order";
import { IOrder } from "@/types/order";
import { OrderList } from "@/components/Dashboard/Order/OrderList";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";

interface IDashboardOrderPageProps {
  orders: IOrder[];
}

const OrderListPage = ({ orders }: IDashboardOrderPageProps) => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Order list
          </Typography>
        </Stack>
        <Card elevation={0}>
          <OrderList orders={orders} />
        </Card>
      </Container>
    </DashboardLayout>
  );
};

OrderListPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps = async (context: any) => {
  const { req, res } = context;
  const orders: IOrder[] = await orderAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return { props: { orders: orders } };
};

export default OrderListPage;
