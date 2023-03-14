// /dashboard/product/add

// next.js
// react
import { ReactElement, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
import ProductListTopLine from "@/components/Dashboard/Catalog/Products/List/TopLine";
import DashboardContentWithSaveFooter from "@/components/Dashboard/Generic/EditableContent";
import TopLineWithReturn from "@/components/Dashboard/Catalog/Products/TopLineWithReturn";
// mui
import Container from "@mui/material/Container";

const DashboardProductsEditPage = () => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <DashboardContentWithSaveFooter
          preventNavigation={true}
          setPreventNavigation={setPreventNavigation}
        >
          <TopLineWithReturn
            title={"Add product"}
            returnPath={"/dashboard/catalog/products"}
          />
        </DashboardContentWithSaveFooter>
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
  return {
    props: {},
  };
};

export default DashboardProductsEditPage;
