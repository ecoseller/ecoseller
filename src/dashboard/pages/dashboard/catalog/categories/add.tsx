import React, { ReactElement } from "react";
import RootLayout from "@/pages/layout";
import DashboardLayout from "@/pages/dashboard/layout";
import Container from "@mui/material/Container";
import CategoryEditorWrapper from "@/components/Dashboard/Catalog/Categories/Editor/CategoryEditorWrapper";
import { ICategoryEditable } from "@/types/category";

const CategoryAddPage = () => {
  const emptyCategory: ICategoryEditable = {
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
    parent: null,
  };

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <CategoryEditorWrapper
          initialCategory={emptyCategory}
          creatingNew={true}
          title="Add category"
        />
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
