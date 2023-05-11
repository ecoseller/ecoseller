// /dashboard/orders

// layout
import DashboardLayout from "@/pages/dashboard/layout";
//react
import { ReactElement } from "react";
import RootLayout from "@/pages/layout";
// components

// mui
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";

import UserGrid from "@/components/Dashboard/UsersRoles/Users/UsersGeneralInformation";
import GroupsGrid from "@/components/Dashboard/UsersRoles/Roles/RolesGenerealInformation";
import { PermissionProvider } from "@/utils/context/permission";

const DashboardRolesAndUsersPage = () => {
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Users and roles
      </Typography>
      <PermissionProvider permission="user_change_permission">
        <UserGrid />
      </PermissionProvider>
      <Grid item xs={12} md={6} lg={8} sx={{ paddingTop: 2 }}></Grid>
      <PermissionProvider permission="group_change_permission">
        <GroupsGrid />
      </PermissionProvider>
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

export default DashboardRolesAndUsersPage;
