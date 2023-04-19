// /dashboard/products
// next.js
// libraries

// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { ReactElement } from "react";
import RootLayout from "@/pages/layout";
// components
import ProductListTopLine from "@/components/Dashboard/Catalog/Products/List/TopLine";
import ProductGrid from "@/components/Dashboard/Catalog/Products/List/ProductGrid";
// mui
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";

// types

const DashboardProductsPage = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <ProductListTopLine />
        <Card elevation={0}>
          <ProductGrid />
        </Card>
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

export const getServerSideProps = async (context: any) => {
  console.log("Dashboard list of products");

  return {
    props: {},
  };
};

export default DashboardProductsPage;
