// /dashboard/product/add

// next.js
// react
import { ReactElement, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
import ProductEditorWrapper from "@/components/Dashboard/Catalog/Products/Editor/ProductEditorWrapper";
// mui
import Container from "@mui/material/Container";
import { useRouter } from "next/router";

interface IProps {
  // id: string;
}

const DashboardProductsEditPage = ({}: IProps) => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
  const router = useRouter();
  const { id } = router.query;

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <ProductEditorWrapper
          title={`Edit product ${id}`}
          returnPath={"/dashboard/catalog/products"}
          productId={Array.isArray(id) ? id[0] : id}
        />
      </Container>
    </DashboardLayout>
  );
};

DashboardProductsEditPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServersideProps = async (context: any) => {
  // const { id } = context.query;

  return {
    props: {
      // id,
    },
  };
};

export default DashboardProductsEditPage;
