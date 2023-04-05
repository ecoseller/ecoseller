import React, { ReactElement } from "react";
import RootLayout from "@/pages/layout";
import DashboardLayout from "@/pages/dashboard/layout";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import Grid from "@mui/material/Grid";
import CategoryTranslatedFields from "@/components/Dashboard/Catalog/Categories/Editor/CategoryTranslatedFields";

const CategoryAddPage = () => {
  return (
    <DashboardLayout>
      <TopLineWithReturn
        title="Add category"
        returnPath="/dashboard/catalog/categories"
      />
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          {/*<ProductTranslatedFieldsWrapper*/}
          {/*  state={productState}*/}
          {/*  dispatch={dispatchProductState}*/}
          {/*/>*/}
          <CategoryTranslatedFields />
        </Grid>
        <Grid item md={4} xs={12}>
          {/*<ProductCategorySelect*/}
          {/*  state={productState}*/}
          {/*  dispatch={dispatchProductState}*/}
          {/*/>*/}
          yyy
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

CategoryAddPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default CategoryAddPage;
