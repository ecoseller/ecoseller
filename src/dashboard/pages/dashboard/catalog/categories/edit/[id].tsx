import React, { ReactElement, useEffect, useState } from "react";
import RootLayout from "@/pages/layout";
import DashboardLayout from "@/pages/dashboard/layout";
import Container from "@mui/material/Container";
import CategoryEditorWrapper from "@/components/Dashboard/Catalog/Categories/Editor/CategoryEditorWrapper";
import { ICategoryDetail, ICategoryEditable } from "@/types/category";
import { deleteCategory, getCategory } from "@/api/category/category";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import Box from "@mui/material/Box";
import { OutputData } from "@editorjs/editorjs";
import { IProduct } from "@/types/product";
import { axiosPrivate } from "@/utils/axiosPrivate";

interface ICategoryEditPageProps{
  category: ICategoryDetail
}

const CategoryEditPage = ({category} : ICategoryEditPageProps) => {

  const router = useRouter();
  const categoryId = category.id.toString();
  
  async function deleteCat() {
    deleteCategory(categoryId).then(() => {
      router.push("/dashboard/catalog/categories");
    });
  }

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
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
      </Container>
    </DashboardLayout>
  );
};

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;
  
  const categoryRes = await getCategory(id);
  const category = categoryRes.data;

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
