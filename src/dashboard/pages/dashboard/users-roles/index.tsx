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
import { Grid } from "@mui/material";
import TopLineWithReturn from "@/components/Dashboard/Catalog/Products/TopLineWithReturn";
import { axiosPrivate } from "@/utils/axiosPrivate";
import { IUser } from "@/types/user";
import { GetServerSideProps } from "next";

import UserGrid from "@/components/Dashboard/Roles/UsersGeneralInformation";
import GroupsGrid from "@/components/Dashboard/Roles/RolesGenerealInformation";

const DashboardRolesAndUsersPage = () => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);

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
