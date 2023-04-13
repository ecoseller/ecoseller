// /dashboard/orders

// layout
import DashboardLayout from "@/pages/dashboard/layout";
//react
import { ReactElement, useState } from "react";
import RootLayout from "@/pages/layout";
// components

// mui
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import { GetServerSideProps } from "next";

import UserGrid from "@/components/Dashboard/Roles/UsersGeneralInformation";
import GroupsGrid from "@/components/Dashboard/Roles/RolesGenerealInformation";

const DashboardRolesAndUsersPage = () => {
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Users and roles
      </Typography>
      <UserGrid />
      <Grid item xs={12} md={6} lg={8} sx={{ paddingTop: 2 }}></Grid>
      <GroupsGrid />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("Get server side props users and roles");

  return {
    props: {},
  };
};

export default DashboardRolesAndUsersPage;
