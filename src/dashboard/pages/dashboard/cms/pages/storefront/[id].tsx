import { getFrontendPage } from "@/api/cms/page/page";
import PageEditorWrapper from "@/components/Dashboard/CMS/Pages/Edit/Editor";
import { cmsPageDetailAPI } from "@/pages/api/cms/page/[type]/[id]";
import DashboardLayout from "@/pages/dashboard/layout";
import RootLayout from "@/pages/layout";
import { IPageFrontend } from "@/types/cms";
import { axiosPrivate } from "@/utils/axiosPrivate";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import { ReactElement } from "react";

interface IProps {
  pageDetail: IPageFrontend;
}

const StorefrontPageEdit = ({ pageDetail }: IProps) => {
  const router = useRouter();
  const { id } = router.query;

  console.log("pageDetail", pageDetail);
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <PageEditorWrapper storefrontPageData={pageDetail} />
      </Container>
    </DashboardLayout>
  );
};

StorefrontPageEdit.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const { id } = context.query;

  const pageDetail = await cmsPageDetailAPI(
    "GET",
    "frontend",
    id as string,
    req as NextApiRequest,
    res as NextApiResponse
  );
  return {
    props: {
      pageDetail,
    },
  };
};

export default StorefrontPageEdit;
