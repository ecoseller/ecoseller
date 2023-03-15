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
import { IProduct } from "@/types/product";
import { axiosPrivate } from "@/utils/axiosPrivate";

interface IProps {
  // id: string;
  product: IProduct;
}

const DashboardProductsEditPage = ({ product }: IProps) => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
  const router = useRouter();
  const { id } = router.query;

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <ProductEditorWrapper
          title={`Edit product ${id}`}
          returnPath={"/dashboard/catalog/products"}
          productData={product}
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

export const getServerSideProps = async (context: any) => {
  const { id } = context.params;
  console.log("id", id);
  // feth product data
  const productRes = await axiosPrivate.get(`/product/dashboard/detail/${id}/`);
  const product = productRes.data;

  console.log("product", product);
  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product,
    },
  };
};

export default DashboardProductsEditPage;
