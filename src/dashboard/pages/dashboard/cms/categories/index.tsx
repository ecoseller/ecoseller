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
import PagesList from "@/components/Dashboard/CMS/Pages/List/PagesList";
import { getAllPageCategories } from "@/api/cms/category/category";
import PageCategoriesListTopLine from "@/components/Dashboard/CMS/Categories/List/PageCategoriesListTopLine";
import PageCategoriesList from "@/components/Dashboard/CMS/Categories/List/PageCategoriesList";

const PageCategoriesPage = ({
  categories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <PageCategoriesListTopLine />
        <Card elevation={0}>
          <PageCategoriesList categories={categories} />
        </Card>
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
  const res = await getAllPageCategories();
  const categories = res;

  return { props: { categories: categories } };
}

export default PageCategoriesPage;
