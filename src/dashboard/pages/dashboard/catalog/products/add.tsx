// /dashboard/product/add
// react
// next.js
import { useRouter } from "next/router";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { ReactElement, useState } from "react";
import RootLayout from "@/pages/layout";
// components
import DashboardContentWithSaveFooter from "@/components/Dashboard/Generic/EditableContent";
import TopLineWithReturn from "@/components/Dashboard/Catalog/Products/TopLineWithReturn";
// mui
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import ProductCategorySelect from "@/components/Dashboard/Catalog/Products/Editor/Product/ProductCategorySelect";
import ProductBasicInfo from "@/components/Dashboard/Catalog/Products/Editor/Product/ProductBasicInfo";
import ProductTranslatedFieldsWrapper from "@/components/Dashboard/Catalog/Products/Editor/Product/ProductTranslatedFields";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import ProductVariantsEditor from "@/components/Dashboard/Catalog/Products/Editor/Product/ProductVariantsEditor";
import ProductMediaEditor from "@/components/Dashboard/Catalog/Products/Editor/Product/ProductMediaEditor";
import ProductVariantPricesEditor from "@/components/Dashboard/Catalog/Products/Editor/Product/ProductVariantPricesEditor";
import ProductEditorWrapper from "@/components/Dashboard/Catalog/Products/Editor/ProductEditorWrapper";
import { IAttributeType } from "@/types/product";
import { IPriceList } from "@/types/localization";
import { axiosPrivate } from "@/utils/axiosPrivate";

interface IProps {
  attributesData: IAttributeType[];
  pricelistsData: IPriceList[];
}

const DashboardProductsAddPage = ({
  attributesData,
  pricelistsData,
}: IProps) => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <ProductEditorWrapper
          title={"Add product"}
          returnPath={"/dashboard/catalog/products"}
          attributesData={attributesData}
          pricelistsData={pricelistsData}
        />
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

  console.log("Dashboard product add");
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

export default DashboardProductsAddPage;