import React, { ReactElement } from "react";
import RootLayout from "@/pages/layout";
import DashboardLayout from "@/pages/dashboard/layout";
import Container from "@mui/material/Container";
import CategoryEditorWrapper from "@/components/Dashboard/Catalog/Categories/Editor/CategoryEditorWrapper";
import { ICategoryDetail } from "@/types/category";
import { useRouter } from "next/router";
import { NextApiRequest, NextApiResponse } from "next";
import { categoryDetailAPI } from "@/pages/api/category/[id]";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import Box from "@mui/material/Box";
import { PermissionProvider } from "@/utils/context/permission";

interface ICategoryEditPageProps {
  category: ICategoryDetail;
}

const CategoryEditPage = ({ category }: ICategoryEditPageProps) => {
  const router = useRouter();
  const categoryId = category.id.toString();

  return (
    <>
      <Container maxWidth="xl">
        <PermissionProvider allowedPermissions={["category_change_permission"]}>
          <CategoryEditorWrapper
            initialCategory={category}
            creatingNew={false}
            title={`Edit category #${categoryId}`}
            categoryId={categoryId}
          />
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <EditorCard>
                <CollapsableContentWithTitle title="Delete">
                  <Box>
                    <Button variant="contained" onClick={deleteCat}>
                      Delete
                    </Button>
                  </Box>
                </CollapsableContentWithTitle>
              </EditorCard>
            </Grid>
          </Grid>
        </PermissionProvider>
      </Container>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const { req, res } = context;
  const { id } = context.params;

  const category = await categoryDetailAPI(
    "GET",
    id,
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      category,
    },
  };
};

CategoryEditPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default CategoryEditPage;
