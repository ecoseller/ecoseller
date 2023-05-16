import DashboardLayout from "@/pages/dashboard/layout";
import { ReactElement } from "react";
import RootLayout from "@/pages/layout";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const DashboardOrdersPage = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Order list
        </Typography>
      </Container>
    </DashboardLayout>
  );
};

DashboardOrdersPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps = async (context: any) => {
  console.log("Dashboard orders");
  return {
    props: {},
  };
};

export default DashboardOrdersPage;
