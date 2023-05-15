import React, { ReactElement } from "react";
import RootLayout from "@/pages/layout";
import DashboardLayout from "@/pages/dashboard/layout";
import Container from "@mui/material/Container";
import CategoryEditorWrapper from "@/components/Dashboard/Catalog/Categories/Editor/CategoryEditorWrapper";
import { ICategoryEditable } from "@/types/category";
import { OutputData } from "@editorjs/editorjs";
import { PermissionProvider } from "@/utils/context/permission";

const CategoryAddPage = () => {
  const emptyCategory: ICategoryEditable = {
    published: true,
    translations: {
      en: {
        slug: "",
        title: "",
        description: "",
        meta_description: "",
        description_editorjs: {} as OutputData,
        meta_title: "",
      },
      cs: {
        slug: "",
        title: "",
        description: "",
        meta_description: "",
        description_editorjs: {} as OutputData,
        meta_title: "",
      },
    },
    parent: null,
  };

  return (
    <DashboardLayout>
      <PermissionProvider allowedPermissions={["category_add_permission"]}>
        <Container maxWidth="xl">
          <CategoryEditorWrapper
            initialCategory={emptyCategory}
            creatingNew={true}
            title="Add category"
          />
        </Container>
      </PermissionProvider>
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
