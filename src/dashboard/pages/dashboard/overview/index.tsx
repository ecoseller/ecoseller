// /dashboard/overview

// layout
import DashboardLayout from "../layout";
//react
import { ReactElement } from "react";
import RootLayout from "../../layout";
// components

// mui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const DashboardOverviewPage = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, John.
        </Typography>
      </Container>
    </DashboardLayout>
  );
};

DashboardOverviewPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServersideProps = async (context: any) => {
  console.log("Dashboard overview");
  return {
    props: {},
  };
};

export default DashboardOverviewPage;
