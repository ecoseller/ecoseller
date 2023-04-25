import { getFrontendPage } from "@/api/cms/page/page";
import PageEditorWrapper from "@/components/Dashboard/CMS/Pages/Edit/Editor";
import DashboardLayout from "@/pages/dashboard/layout";
import RootLayout from "@/pages/layout";
import { IPageFrontend } from "@/types/cms";
import { axiosPrivate } from "@/utils/axiosPrivate";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";
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
  const params = context.params;
  const id = params?.id;

  const pageDetail = await getFrontendPage(Number(id));

  return {
    props: {
      pageDetail,
    },
  };
};

export default StorefrontPageEdit;
