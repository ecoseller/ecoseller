import PageEditorWrapper from "@/components/Dashboard/CMS/Pages/Edit/Editor";
import DashboardLayout from "@/pages/dashboard/layout";
import RootLayout from "@/pages/layout";
import { IPageCMS, IPageFrontend } from "@/types/cms";
import { axiosPrivate } from "@/utils/axiosPrivate";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ReactElement } from "react";

interface IProps {
  pageDetail: IPageCMS;
}

const CMSPageEdit = ({ pageDetail }: IProps) => {
  const router = useRouter();
  const { id } = router.query;

  console.log("pageDetail", pageDetail);
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <PageEditorWrapper cmsPageData={pageDetail} />
      </Container>
    </DashboardLayout>
  );
};

CMSPageEdit.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params;
  const id = params?.id;

  const pageDetailRes = await axiosPrivate.get(`/cms/page/cms/${id}/`);
  const pageDetail = pageDetailRes.data;

  return {
    props: {
      pageDetail,
    },
  };
};

export default CMSPageEdit;
