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

import UsersGrid from "@/components/Dashboard/UsersRoles/Users/UsersGeneralInformation";
import GroupsGrid from "@/components/Dashboard/UsersRoles/Roles/RolesGenerealInformation";
import { PermissionProvider } from "@/utils/context/permission";
import { IUser } from "@/types/user";
import { usersAPI } from "@/pages/api/user/users";
import { NextApiRequest, NextApiResponse } from "next";
import { userRoleAPI } from "@/pages/api/roles/user/[email]";

interface IUserRolesProps {
  users: IUser[];
}

const DashboardRolesAndUsersPage = ({ users }: IUserRolesProps) => {
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Users and roles
      </Typography>
      <PermissionProvider allowedPermissions={["user_change_permission"]}>
        <UsersGrid users={users} />
      </PermissionProvider>
      <Grid item xs={12} md={6} lg={8} sx={{ paddingTop: 2 }}></Grid>
      <PermissionProvider allowedPermissions={["group_change_permission"]}>
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

export const getServerSideProps = async (context: any) => {
  const { req, res } = context;

  const users: IUser[] = await usersAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  )

  for (let user of users) {
    user.roles = []
    if (user.is_admin) {
      user.roles.push("Admin")
    }

    const userRoles = await userRoleAPI(
      "GET",
      user.email,
      req as NextApiRequest,
      res as NextApiResponse
    )

    for (let userRole of userRoles) {
      user.roles.push(userRole.name)
    }
  }

  return { props: { users: users } };
};
export default DashboardRolesAndUsersPage;
