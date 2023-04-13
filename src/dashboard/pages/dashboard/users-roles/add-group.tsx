import { useRouter } from "next/router";
import RootLayout from "@/pages/layout";
import { ReactElement, useState } from "react";
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { Container, Typography } from "@mui/material";

const DashboardGroupAddPage = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(router.query);

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Typography>Add Group</Typography>
      </Container>
    </DashboardLayout>
  );
};

DashboardGroupAddPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default DashboardGroupAddPage;
