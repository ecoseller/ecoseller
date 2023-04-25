// react
import { ReactElement } from "react";
// layout
import RootLayout from "@/pages/layout";
// mui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getAllCategories } from "@/api/category/category";
import { InferGetServerSidePropsType } from "next";
import Card from "@mui/material/Card";
// api
// components
import DashboardLayout from "@/pages/dashboard/layout";
import { getAllPageCategories } from "@/api/cms/category/category";
import PageCategoriesListTopLine from "@/components/Dashboard/CMS/Categories/List/PageCategoriesListTopLine";
import PageCategoriesList from "@/components/Dashboard/CMS/Categories/List/PageCategoriesList";
import { getAllPageCategoryTypes } from "@/api/cms/category/type/type";
import PageCategoryTypeListTopLine from "@/components/Dashboard/CMS/Categories/List/PageCategoryTypeListTopLine";
import PageCategoryTypeList from "@/components/Dashboard/CMS/Categories/List/PageCategoryTypeList";

const PageCategoriesPage = ({
  categories,
  types,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <PageCategoriesListTopLine />
        <Card elevation={0}>
          <PageCategoriesList categories={categories} />
        </Card>
        <PageCategoryTypeListTopLine />
        <PageCategoryTypeList types={types} />
      </Container>
    </DashboardLayout>
  );
};

PageCategoriesPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export async function getServerSideProps() {
  const categories = await getAllPageCategories();
  const types = await getAllPageCategoryTypes();

  return { props: { categories: categories, types: types } };
}

export default PageCategoriesPage;
