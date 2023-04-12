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
import { Grid, Stack } from "@mui/material";
import TopLineWithReturn from "@/components/Dashboard/Catalog/Products/TopLineWithReturn";
import { axiosPrivate } from "@/utils/axiosPrivate";
import { IUser } from "@/types/user";
import { GetServerSideProps } from "next";

import UserGrid from "@/components/Dashboard/Roles/UsersGeneralInformation";
import GroupsGrid from "@/components/Dashboard/Roles/RolesGenerealInformation";
interface IProps {
  users: IUser[];
}

const DashboardRolesAndUsersPage = ({
  users,
}: IProps) => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
  const [state, setState] = useState<IUser[]>(users);
  console.log("users", users);

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

  const users: IUser[] = [];
  const usrs = await axiosPrivate.get(
    `/user/users`
  );
  // console.log(users.data);
  for (const user of usrs.data) {
    users.push({
      email: user['email'],
      first_name: user['first_name'],
      last_name: user['last_name'],
      is_admin: user['is_admin'],
      roles: []
    });
    console.log(user['email']);
    const userRoles = await axiosPrivate.get(
      `roles/get-groups/${user['email']}`
    );
    for (const role of userRoles.data) {
      users[users.length - 1].roles.push(role.name);
    }
  }
  console.log(users);
  return {
    props: { users },
  };
};

export default DashboardRolesAndUsersPage;