// /dashboard/products

// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { ReactElement } from "react";
import RootLayout from "@/pages/layout";
// components

// mui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ProductListTopLine from "@/components/Dashboard/Catalog/Products/List/TopLine";

const DashboardProductsPage = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <ProductListTopLine />
      </Container>
    </DashboardLayout>
  );
};

DashboardProductsPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServersideProps = async (context: any) => {
  console.log("Dashboard orders");
  return {
    props: {},
  };
};

export default DashboardProductsPage;
