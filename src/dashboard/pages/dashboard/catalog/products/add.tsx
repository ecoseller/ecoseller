// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { ReactElement } from "react";
import RootLayout from "@/pages/layout";
// components
// mui
import Container from "@mui/material/Container";
import ProductEditorWrapper from "@/components/Dashboard/Catalog/Products/Editor/ProductEditorWrapper";
import { IAttributeType, IProductType } from "@/types/product";
import { IPriceList } from "@/types/localization";
import { axiosPrivate } from "@/utils/axiosPrivate";
import { PermissionProvider } from "@/utils/context/permission";

interface IProps {
  attributesData: IAttributeType[];
  pricelistsData: IPriceList[];
  productTypeData: IProductType[];
}

const DashboardProductsAddPage = ({
  attributesData,
  pricelistsData,
  productTypeData,
}: IProps) => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <PermissionProvider permission="product_add_permission">
          <ProductEditorWrapper
            title={"Add product"}
            returnPath={"/dashboard/catalog/products"}
            attributesData={attributesData}
            pricelistsData={pricelistsData}
            productTypeData={productTypeData}
          />
        </PermissionProvider>
      </Container>
    </DashboardLayout>
  );
};

DashboardProductsAddPage.getLayout = (page: ReactElement) => {
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
   *
   * We don't fetch product data here because we are creating new product
   */

  console.log("Dashboard product add");
  // fetch attributes data
  const attributesRes = await axiosPrivate.get(
    "product/dashboard/attribute/type/"
  );
  const attributesData = attributesRes.data;

  const productTypeRes = await axiosPrivate.get("product/dashboard/type/");
  const productTypeData = productTypeRes.data;

  // fetch pricelists data
  const pricelistsRes = await axiosPrivate.get("product/dashboard/pricelist/");
  const pricelistsData = pricelistsRes.data;

  return {
    props: {
      attributesData,
      pricelistsData,
      productTypeData,
    },
  };
};

export default DashboardProductsAddPage;
