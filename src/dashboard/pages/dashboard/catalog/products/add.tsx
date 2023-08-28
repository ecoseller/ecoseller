// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { ReactElement } from "react";
import RootLayout from "@/pages/layout";
// components
// mui
import Container from "@mui/material/Container";
import ProductEditorWrapper from "@/components/Dashboard/Catalog/Products/Editor/ProductEditorWrapper";
import { IAttributeType, IProductType } from "@/types/product";
import { IPriceList } from "@/types/localization";
import { axiosPrivate } from "@/utils/axiosPrivate";
import { PermissionProvider } from "@/utils/context/permission";
import { productAttributeTypeAPI } from "@/pages/api/product/attribute/type";
import { NextApiRequest, NextApiResponse } from "next";
import { pricelistListAPI } from "@/pages/api/product/price-list";
import { productTypeListAPI } from "@/pages/api/product/type";

interface IProps {
  attributesData: IAttributeType[];
  pricelistsData: IPriceList[];
  productTypeData: IProductType[];
}

const DashboardProductsAddPage = ({
  attributesData,
  pricelistsData,
  productTypeData,
}: IProps) => {
  return (
    <DashboardLayout>
      <Container maxWidth={false}>
        <PermissionProvider allowedPermissions={["product_add_permission"]}>
          <ProductEditorWrapper
            title={"Add product"}
            returnPath={"/dashboard/catalog/products"}
            attributesData={attributesData}
            pricelistsData={pricelistsData}
            productTypeData={productTypeData}
          />
        </PermissionProvider>
      </Container>
    </DashboardLayout>
  );
};

DashboardProductsAddPage.getLayout = (page: ReactElement) => {
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
   *
   * We don't fetch product data here because we are creating new product
   */
  const { req, res } = context;

  console.log("Dashboard product add");
  // fetch attributes data
  const attributesData = await productAttributeTypeAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  const productTypeData = await productTypeListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  // fetch pricelists data
  const pricelistsData = await pricelistListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      attributesData,
      pricelistsData,
      productTypeData,
    },
  };
};

export default DashboardProductsAddPage;
