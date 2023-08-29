import React, { ReactElement } from "react";
import RootLayout from "@/pages/layout";
import DashboardLayout from "@/pages/dashboard/layout";
import Container from "@mui/material/Container";
import CategoryEditorWrapper from "@/components/Dashboard/Catalog/Categories/Editor/CategoryEditorWrapper";
import { ICategoryDetail } from "@/types/category";
import { useRouter } from "next/router";
import { NextApiRequest, NextApiResponse } from "next";
import { categoryDetailAPI } from "@/pages/api/category/[id]";
import { PermissionProvider } from "@/utils/context/permission";

interface ICategoryEditPageProps {
  category: ICategoryDetail;
}

const CategoryEditPage = ({ category }: ICategoryEditPageProps) => {
  const router = useRouter();
  const categoryId = category.id.toString();

  return (
    <DashboardLayout>
      <Container maxWidth={false}>
        <PermissionProvider allowedPermissions={["category_change_permission"]}>
          <CategoryEditorWrapper
            initialCategory={category}
            creatingNew={false}
            title={`Edit category #${categoryId}`}
            categoryId={categoryId}
          />
        </PermissionProvider>
      </Container>
    </DashboardLayout>
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
