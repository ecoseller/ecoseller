// /dashboard/orders

// layout
import DashboardLayout from "@/pages/dashboard/layout";
//react
import { ReactElement } from "react";
import RootLayout from "@/pages/layout";
// components

// mui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const DashboardCategoriesPage = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Categories list
        </Typography>
      </Container>
    </DashboardLayout>
  );
};

DashboardCategoriesPage.getLayout = (page: ReactElement) => {
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

export default DashboardCategoriesPage;