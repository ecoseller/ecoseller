// /dashboard/product/add

// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { ReactElement } from "react";
import RootLayout from "@/pages/layout";
// components

// mui
import Container from "@mui/material/Container";
import ProductListTopLine from "@/components/Dashboard/Catalog/Products/List/TopLine";

const DashboardProductsEditPage = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <ProductListTopLine />
      </Container>
    </DashboardLayout>
  );
};

DashboardProductsEditPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServersideProps = async (context: any) => {
  return {
    props: {},
  };
};

export default DashboardProductsEditPage;
