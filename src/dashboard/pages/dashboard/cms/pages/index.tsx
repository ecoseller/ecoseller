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
import { getAllPages } from "@/api/cms/page/page";
// components
import DashboardLayout from "@/pages/dashboard/layout";
import PagesList from "@/components/Dashboard/CMS/Pages/List/PagesList";
import PagesListTopLine from "@/components/Dashboard/CMS/Pages/List/TopLine";
import { cmsPageListAPI } from "@/pages/api/cms/page";

const CMSPagesPage = ({
  pages,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <DashboardLayout>
      <Container maxWidth={false}>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  const pages = await cmsPageListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return { props: { pages: pages } };
};

export default CMSPagesPage;
