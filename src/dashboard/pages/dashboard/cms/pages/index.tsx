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
import { getAllPages } from "@/api/cms/page/page";
// components
import DashboardLayout from "@/pages/dashboard/layout";
import PagesList from "@/components/Dashboard/CMS/Pages/List/PagesList";
import PagesListTopLine from "@/components/Dashboard/CMS/Pages/List/TopLine";

const CMSPagesPage = ({
  pages,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <PagesListTopLine />
        <Card elevation={0}>
          <PagesList pages={pages} />
        </Card>
      </Container>
    </DashboardLayout>
  );
};

CMSPagesPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export async function getServerSideProps() {
  const res = await getAllPages();
  const pages = res;

  return { props: { pages: pages } };
}

export default CMSPagesPage;
