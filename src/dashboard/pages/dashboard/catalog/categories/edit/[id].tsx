import React, { ReactElement } from "react";
import RootLayout from "@/pages/layout";
import DashboardLayout from "@/pages/dashboard/layout";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import Grid from "@mui/material/Grid";
import CategoryTranslatedFields from "@/components/Dashboard/Catalog/Categories/Editor/CategoryTranslatedFields";
import Container from "@mui/material/Container";
import CategoryEditorWrapper from "@/components/Dashboard/Catalog/Categories/Editor/CategoryEditorWrapper";

const CategoryEditPage = () =>
{
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        Not implemented yet...
      </Container>
    </DashboardLayout>
  );
};

CategoryEditPage.getLayout = (page: ReactElement) =>
{
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default CategoryEditPage;
