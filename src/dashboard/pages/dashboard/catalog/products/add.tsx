// /dashboard/product/add
// react
// next.js
import { useRouter } from "next/router";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { ReactElement, useState } from "react";
import RootLayout from "@/pages/layout";
// components
import DashboardContentWithSaveFooter from "@/components/Dashboard/Generic/EditableContent";
import TopLineWithReturn from "@/components/Dashboard/Catalog/Products/TopLineWithReturn";
// mui
import Container from "@mui/material/Container";

const DashboardProductsAddPage = () => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);

  const router = useRouter();

  return (
    <DashboardLayout>
      <Container maxWidth="xl"></Container>
      <DashboardContentWithSaveFooter
        preventNavigation={true}
        setPreventNavigation={setPreventNavigation}
      >
        <TopLineWithReturn
          title={"Add product"}
          returnPath={"/dashboard/catalog/products"}
        />
      </DashboardContentWithSaveFooter>
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

export const getServersideProps = async (context: any) => {
  return {
    props: {},
  };
};

export default DashboardProductsAddPage;
