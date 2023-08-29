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
    translations: {},
    parent: null,
  };

  return (
    <DashboardLayout>
      <PermissionProvider allowedPermissions={["category_add_permission"]}>
        <Container maxWidth={false}>
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
