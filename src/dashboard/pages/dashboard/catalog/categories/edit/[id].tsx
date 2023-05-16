import React, { ReactElement } from "react";
import RootLayout from "@/pages/layout";
import DashboardLayout from "@/pages/dashboard/layout";
import Container from "@mui/material/Container";
import CategoryEditorWrapper from "@/components/Dashboard/Catalog/Categories/Editor/CategoryEditorWrapper";
import { ICategoryDetail } from "@/types/category";
import { deleteCategory, getCategory } from "@/api/category/category";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import Box from "@mui/material/Box";

interface ICategoryEditPageProps {
  category: ICategoryDetail;
}

const CategoryEditPage = ({ category }: ICategoryEditPageProps) => {
  const router = useRouter();
  const categoryId = category.id.toString();

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <CategoryEditorWrapper
          initialCategory={category}
          creatingNew={false}
          title={`Edit category #${categoryId}`}
          categoryId={categoryId}
        />
      </Container>
    </DashboardLayout>
  );
};

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;

  const category = await getCategory(id);

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
