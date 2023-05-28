import { getAllPageCategories } from "@/api/cms/category/category";
import PageCategoryForm from "@/components/Dashboard/CMS/Categories/Editor/Form";
import PageEditorWrapper from "@/components/Dashboard/CMS/Pages/Edit/Editor";
import { cmsCategoryDetailAPI } from "@/pages/api/cms/category/[id]";
import DashboardLayout from "@/pages/dashboard/layout";
import RootLayout from "@/pages/layout";
import { IPageCategory, IPageFrontend } from "@/types/cms";
import { axiosPrivate } from "@/utils/axiosPrivate";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
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
  const { req, res } = context;

  const { id } = context.query;

  const pageCategoryDetail = await cmsCategoryDetailAPI(
    "GET",
    id as string,
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      pageCategoryDetail,
    },
  };
};

export default PageCategoryEdit;
