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

const DashboardProductsAddPage = () => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);

  const router = useRouter();

  return (
    <DashboardLayout>
      <Container maxWidth="xl"></Container>
      <DashboardContentWithSaveFooter
        preventNavigation={true}
        setPreventNavigation={setPreventNavigation}
      >
        <TopLineWithReturn
          title={"Add product"}
          returnPath={"/dashboard/catalog/products"}
        />

        <Grid container spacing={2} direction={{ xs: "column", md: "row" }}>
          <Grid item md={8} xs={"auto"}>
            <ProductBasicInfo />
            <ProductTranslatedFieldsWrapper />
            <ProductVariantsEditor disabled={false} />
            <ProductMediaEditor disabled={true} />
            <ProductVariantPricesEditor disabled={true} />
          </Grid>
          <Grid item md={4} xs={"auto"}>
            <ProductCategorySelect />
          </Grid>
        </Grid>
      </DashboardContentWithSaveFooter>
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

export const getServersideProps = async (context: any) => {
  return {
    props: {},
  };
};

export default DashboardProductsAddPage;
