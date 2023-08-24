// /dashboard/product/add

// next.js
// react
import { ReactElement, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
import ProductEditorWrapper from "@/components/Dashboard/Catalog/Products/Editor/ProductEditorWrapper";
// mui
import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import { IAttributeType, IProduct } from "@/types/product";
import { axiosPrivate } from "@/utils/axiosPrivate";
import { IPriceList } from "@/types/localization";
import { PermissionProvider } from "@/utils/context/permission";
import { pricelistListAPI } from "@/pages/api/product/price-list";
import { productDetailAPI } from "@/pages/api/product/[id]";
import { NextApiRequest, NextApiResponse } from "next";

interface IProps {
  product: IProduct; // atributesData are gotten directly from product: IProduct
  pricelistsData: IPriceList[];
}

const DashboardProductsEditPage = ({ product, pricelistsData }: IProps) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <PermissionProvider allowedPermissions={["product_add_permission"]}>
          <ProductEditorWrapper
            title={`Edit product #${id}`}
            returnPath={"/dashboard/catalog/products"}
            productData={product}
            pricelistsData={pricelistsData}
          />
        </PermissionProvider>
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

export const getServerSideProps = async (context: any) => {
  /**
   * Initial data for product editor
   * - attributes
   * - pricelists
   * - product (if id is provided)
   *
   * If id is not provided or product is not found, return 404
   */

  const { req, res } = context;
  const { id } = context.query;
  // feth product data
  const product = await productDetailAPI(
    "GET",
    id,
    req as NextApiRequest,
    res as NextApiResponse
  );

  console.log("product", product);
  if (!product) {
    return {
      notFound: true,
    };
  }

  // fetch pricelists data
  const pricelistsData = await pricelistListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      product,
      pricelistsData,
    },
  };
};

export default DashboardProductsEditPage;
