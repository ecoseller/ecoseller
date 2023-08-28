// react
import { ReactElement } from "react";
// layout
import RootLayout from "@/pages/layout";
// mui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getAllCategories } from "@/api/category/category";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextApiRequest,
  NextApiResponse,
} from "next";
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
import { cmsCategoryListAPI } from "@/pages/api/cms/category";
import { cmsCategoryTypeListAPI } from "@/pages/api/cms/category/type";

const PageCategoriesPage = ({
  categories,
  types,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <DashboardLayout>
      <Container maxWidth={false}>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  const categories = await cmsCategoryListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );
  const types = await cmsCategoryTypeListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return { props: { categories: categories, types: types } };
};

export default PageCategoriesPage;
