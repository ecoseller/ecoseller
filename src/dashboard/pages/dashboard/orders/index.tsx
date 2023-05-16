import DashboardLayout from "@/pages/dashboard/layout";
import { ReactElement } from "react";
import RootLayout from "@/pages/layout";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { NextApiRequest, NextApiResponse } from "next";
import { orderAPI } from "@/pages/api/order";
import { IOrder } from "@/types/order";

interface IDashboardOrderPageProps {
  orders: IOrder[];
}

const DashboardOrdersPage = ({ orders }: IDashboardOrderPageProps) => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Order list
        </Typography>
      </Container>
    </DashboardLayout>
  );
};

DashboardOrdersPage.getLayout = (page: ReactElement) => {
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

export default DashboardOrdersPage;
