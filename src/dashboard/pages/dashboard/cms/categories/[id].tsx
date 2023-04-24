import PageCategoryForm from "@/components/Dashboard/CMS/Categories/Editor/Form";
import PageEditorWrapper from "@/components/Dashboard/CMS/Pages/Edit/Editor";
import DashboardLayout from "@/pages/dashboard/layout";
import RootLayout from "@/pages/layout";
import { IPageCategory, IPageFrontend } from "@/types/cms";
import { axiosPrivate } from "@/utils/axiosPrivate";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ReactElement } from "react";

interface IProps {
  pageCategoryDetail: IPageCategory;
}

const PageCategoryEdit = ({ pageCategoryDetail }: IProps) => {
  const router = useRouter();
  const { id } = router.query;

  console.log("pageCategoryDetail", pageCategoryDetail);
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <PageCategoryForm pageCategoryData={pageCategoryDetail} />
      </Container>
    </DashboardLayout>
  );
};

PageCategoryEdit.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params;
  const id = params?.id;

  const pageCategoryDetailRes = await axiosPrivate.get(`/cms/category/${id}/`);
  const pageCategoryDetail = pageCategoryDetailRes.data;

  return {
    props: {
      pageCategoryDetail,
    },
  };
};

export default PageCategoryEdit;
