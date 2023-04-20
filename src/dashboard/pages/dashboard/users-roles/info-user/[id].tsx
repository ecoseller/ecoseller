import { useRouter } from "next/router";
import RootLayout from "@/pages/layout";
import { ReactElement, useState } from "react";
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { Container, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { getUserData, getUserGroups } from "@/api/users-roles/users";
import { IUser } from "@/types/user";

const DashboardUserInfoPage = (userData: IUser) => {
  const router = useRouter();
  const { id } = router.query;
  console.log(router.query);
  console.log(userData)

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Typography>Info User</Typography>
      </Container>
    </DashboardLayout>
  );
};

DashboardUserInfoPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {

  const email = context.params?.id;
  const userDataRet = await getUserData(email as string)
  const userData: IUser = {
    email: userDataRet.data.email,
    first_name: userDataRet.data.first_name,
    last_name: userDataRet.data.last_name,
    is_admin: userDataRet.data.is_admin,
    roles: []
  }
  const userRolesData = await getUserGroups(email as string)
  for (let i = 0; i < userRolesData.data.length; i++) {
    userData.roles.push(userRolesData.data[i].name)
  }

  return {
    props: { userData: userData }
  }
}

export default DashboardUserInfoPage;
