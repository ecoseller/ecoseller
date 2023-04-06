// /dashboard/orders

// layout
import DashboardLayout from "@/pages/dashboard/layout";
//react
import { ReactElement, useState } from "react";
import RootLayout from "@/pages/layout";
// components

// mui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import DashboardContentWithSaveFooter from "@/components/Dashboard/Generic/EditableContent";
import { Stack } from "@mui/material";
import TopLineWithReturn from "@/components/Dashboard/Catalog/Products/TopLineWithReturn";

const DashboardRolesAndUsersPage = () => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Stack>
          <DashboardContentWithSaveFooter
            primaryButtonTitle="" // To distinguish between create and update actions
            preventNavigation={preventNavigation}
            setPreventNavigation={setPreventNavigation}
            onSave={async () => {
            }}
            returnPath={"/dashboard/catalog/product-types"}
          >
            <TopLineWithReturn
              title={`Users and roles`}
              returnPath={"/dashboard/catalog/product-types"}
            />
          </DashboardContentWithSaveFooter>
        </Stack>
      </Container>
    </DashboardLayout>
  );
};

DashboardRolesAndUsersPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServersideProps = async (context: any) => {
  console.log("Dashboard orders");
  return {
    props: {},
  };
};

export default DashboardRolesAndUsersPage;