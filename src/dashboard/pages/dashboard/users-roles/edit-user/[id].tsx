import { useRouter } from "next/router";
import RootLayout from "@/pages/layout";
import { ReactElement } from "react";
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { Container, Typography } from "@mui/material";
import { IUser } from "@/types/user";
import { GetServerSideProps } from "next";
import { getUserData } from "@/api/users-roles/users";

const DashboardUserEditPage = (userData: IUser) => {
  const router = useRouter();
  const { id } = router.query;
  console.log(router.query);
  console.log(userData)

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Typography>Edit User</Typography>
      </Container>
    </DashboardLayout>
  );
};

DashboardUserEditPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {

  const email = context.params?.id;
  const userData = await getUserData(email as string)

  return {
    props: { userData: userData }
  }
}
export default DashboardUserEditPage;
