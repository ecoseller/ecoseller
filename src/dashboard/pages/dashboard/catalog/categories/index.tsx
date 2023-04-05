import DashboardLayout from "@/pages/dashboard/layout";
import { ReactElement } from "react";
import RootLayout from "@/pages/layout";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getAllCategories } from "@/api/category/category";
import { InferGetServerSidePropsType } from "next";
import CategoryList from "@/components/Dashboard/Catalog/Categories/List/CategoryList";
import CategoryListTopLine from "@/components/Dashboard/Catalog/Categories/List/TopLine";

const CategoriesPage = ({
  categories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <CategoryListTopLine />
        <>
          <CategoryList categories={categories} />
        </>
      </Container>
    </DashboardLayout>
  );
};

CategoriesPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export async function getServerSideProps() {
  const res = await getAllCategories();
  const categories = res.data;

  return { props: { categories: categories } };
}

export default CategoriesPage;
