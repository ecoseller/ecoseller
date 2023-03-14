// /dashboard/products

// libraries
import useSWR from "swr";

// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { ReactElement, useState } from "react";
import RootLayout from "@/pages/layout";
// components
import ProductListTopLine from "@/components/Dashboard/Catalog/Products/List/TopLine";
import ProductListHead from "@/components/Dashboard/Catalog/Products/List/ProductListHead";
// mui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
// types
import { IProductList } from "@/types/product";
import TablePagination from "@mui/material/TablePagination";
import TableBody from "@mui/material/TableBody";
import ProductListBody from "@/components/Dashboard/Catalog/Products/List/ProductListBody";
import TableFooter from "@mui/material/TableFooter";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const DashboardPriceListsPage = () => {
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
            Price lists
          </Typography>
        </Stack>
        <Card elevation={0}></Card>
      </Container>
    </DashboardLayout>
  );
};

DashboardPriceListsPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServersideProps = async (context: any) => {
  console.log("Dashboard pricelists");
  return {
    props: {},
  };
};

export default DashboardPriceListsPage;
