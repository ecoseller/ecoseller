import DashboardLayout from "@/pages/dashboard/layout";
import { ReactElement } from "react";
import RootLayout from "@/pages/layout";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getAllCategories } from "@/api/country/category";
import { InferGetServerSidePropsType } from "next";
import CategoriesList from "@/components/Dashboard/Catalog/Categories/CategoriesList";


const CategoriesPage = ({ categories }: InferGetServerSidePropsType<typeof getServerSideProps>) =>
{
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Categories list
        </Typography>
        <>
          <CategoriesList categories={categories} />
        </>
      </Container>
    </DashboardLayout>
  );
};

CategoriesPage.getLayout = (page: ReactElement) =>
{
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export async function getServerSideProps()
{
  const res = await getAllCategories();
  const categories = await res.data;

  return { props: { categories: categories } };
}

export default CategoriesPage;
