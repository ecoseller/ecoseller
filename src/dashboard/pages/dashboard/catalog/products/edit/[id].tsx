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
import { IAttributeType, IProduct } from "@/types/product";
import { axiosPrivate } from "@/utils/axiosPrivate";
import { IPriceList } from "@/types/localization";

interface IProps {
  product: IProduct;
  attributesData: IAttributeType[];
  pricelistsData: IPriceList[];
}

const DashboardProductsEditPage = ({
  product,
  attributesData,
  pricelistsData,
}: IProps) => {
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
          attributesData={attributesData}
          pricelistsData={pricelistsData}
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
  /**
   * Initial data for product editor
   * - attributes
   * - pricelists
   * - product (if id is provided)
   *
   * If id is not provided or product is not found, return 404
   */

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

  // fetch attributes data
  const attributesRes = await axiosPrivate.get(
    "product/dashboard/attribute/type/"
  );
  const attributesData = attributesRes.data;

  // fetch pricelists data
  const pricelistsRes = await axiosPrivate.get("product/dashboard/pricelist/");
  const pricelistsData = pricelistsRes.data;

  return {
    props: {
      product,
      attributesData,
      pricelistsData,
    },
  };
};

export default DashboardProductsEditPage;
