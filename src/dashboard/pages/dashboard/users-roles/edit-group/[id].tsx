import { useRouter } from "next/router";
import RootLayout from "@/pages/layout";
import { ReactElement } from "react";
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { Container, Typography } from "@mui/material";

const DashboardGroupEditPage = () => {
  const router = useRouter();

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Typography>Edit Group</Typography>
      </Container>
    </DashboardLayout>
  );
};

DashboardGroupEditPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default DashboardGroupEditPage;
