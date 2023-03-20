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
import { IAttributeType, IProductList } from "@/types/product";
import TablePagination from "@mui/material/TablePagination";
import TableBody from "@mui/material/TableBody";
import ProductListBody from "@/components/Dashboard/Catalog/Products/List/ProductListBody";
import TableFooter from "@mui/material/TableFooter";
import TableRow from "@mui/material/TableRow";
import { axiosPrivate } from "@/utils/axiosPrivate";
import { IPriceList } from "@/types/localization";

const DashboardProductsPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 30));
    setPage(0);
  };

  const { data: products } = useSWR<IProductList | undefined>(
    `/product/dashboard/?page=${page + 1}&limit=${rowsPerPage}`
  );

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <ProductListTopLine />
        <Card elevation={0}>{/* Use data grid */}</Card>
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
  console.log("Dashboard orders");
  // fetch attributes data
  const attributesRes = await axiosPrivate.get(
    "product/dashboard/attribute/type/"
  );
  const attributesData = attributesRes.data;

  // fetch pricelists data
  const pricelistsRes = await axiosPrivate.get("product/dashboard/pricelist/");
  const pricelistsData = pricelistsRes.data;

  return {
    props: {
      attributesData,
      pricelistsData,
    },
  };
};

export default DashboardProductsPage;
