import DashboardLayout from "@/pages/dashboard/layout";
import { ReactElement } from "react";
import RootLayout from "@/pages/layout";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getAllCategories } from "@/api/category/category";
import {
  InferGetServerSidePropsType,
  NextApiRequest,
  NextApiResponse,
  NextPageContext,
} from "next";
import CategoryList from "@/components/Dashboard/Catalog/Categories/List/CategoryList";
import CategoryListTopLine from "@/components/Dashboard/Catalog/Categories/List/TopLine";
import Card from "@mui/material/Card";
import { categoryAPI } from "@/pages/api/category";

const CategoriesPage = ({
  categories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <CategoryListTopLine />
        <Card elevation={0}>
          <CategoryList categories={categories} />
        </Card>
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

export async function getServerSideProps(context: NextPageContext) {
  const { req, res } = context;
  const categories = await categoryAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return { props: { categories: categories } };
}

export default CategoriesPage;
