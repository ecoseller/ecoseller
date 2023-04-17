import React, { ReactElement, useState } from "react";
import RootLayout from "@/pages/layout";
import DashboardLayout from "@/pages/dashboard/layout";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import Grid from "@mui/material/Grid";
import CategoryTranslatedFields from "@/components/Dashboard/Catalog/Categories/Editor/CategoryTranslatedFields";
import Container from "@mui/material/Container";
import CategoryEditorWrapper from "@/components/Dashboard/Catalog/Categories/Editor/CategoryEditorWrapper";
import { ICategoryCreateUpdate, ICategoryDetail } from "@/types/category";

const CategoryAddPage = () => {

  const emptyCategory: ICategoryCreateUpdate = {
    published: true,
    translations: {
      en: {
        slug: "",
        title: "",
        description: "",
        meta_description: "",
        meta_title: "",
      },
      cs: {
        slug: "",
        title: "",
        description: "",
        meta_description: "",
        meta_title: "",
      },
    },
  };
  
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <CategoryEditorWrapper initialCategory={emptyCategory} creatingNew={false}/>
      </Container>
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
