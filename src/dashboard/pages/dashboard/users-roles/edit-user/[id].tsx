import { useRouter } from "next/router";
import RootLayout from "@/pages/layout";
import { ReactElement, useEffect, useState } from "react";
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { Alert, Container, Snackbar, Stack, Typography } from "@mui/material";
import { IGroup, IUser } from "@/types/user";
import { GetServerSideProps } from "next";
import { getUserData, getUserGroups, updateUser, getGroups } from "@/api/users-roles/users";
import { getgroups } from "process";
import EditableContentWrapper, { PrimaryButtonAction } from "@/components/Dashboard/Generic/EditableContentWrapper";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import UserGeneralInformation from "@/components/Dashboard/UsersRoles/Users/Editor/User/UserGeneralInformation";
import CreateUser from "@/components/Dashboard/UsersRoles/Users/CreateUser";
import UserGroupsInformation from "@/components/Dashboard/UsersRoles/Users/Editor/User/UserGroupsInformation";

interface IUserEditProps {
  userData: IUser,
  groups: IGroup[],
};

const DashboardUserEditPage = (
  {
    userData,
    groups,
  }: IUserEditProps) => {
  const router = useRouter();
  const { id } = router.query;
  console.log(router.query);
  console.log(userData);
  console.log(groups);

  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
  const [state, setState] = useState<IUser>(userData);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar(null);
  };


  useEffect(() => {
    if (!preventNavigation) {
      setPreventNavigation(true);
    }
  }, [state]);

  console.log("STATE", state);

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <EditableContentWrapper
          primaryButtonTitle={PrimaryButtonAction.Save}
          preventNavigation={preventNavigation}
          setPreventNavigation={setPreventNavigation}
          onButtonClick={async () => {
            await setPreventNavigation(false);
            await updateUser(state)
              .then((res: any) => {
                setSnackbar({
                  open: true,
                  message: "User updated",
                  severity: "success",
                });
              })
              .catch((err: any) => {
                console.log("updateUser", err);
                setSnackbar({
                  open: true,
                  message: "Something went wrong",
                  severity: "error",
                });
              });

          }}
          returnPath={"/dashboard/users-roles"}
        >
          <TopLineWithReturn
            title={`Edit user ${state?.email}`}
            returnPath={"/dashboard/users-roles"}
          />
          <UserGeneralInformation
            state={state}
            setState={(v: IUser) => setState(v)}
          />
          <UserGroupsInformation
            state={state}
            setState={(v: IUser) => setState(v)}
            groups={groups}
          />
        </EditableContentWrapper>
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
  const userDataRet = await getUserData(email as string);
  const userData: IUser = {
    email: userDataRet.data.email,
    first_name: userDataRet.data.first_name,
    last_name: userDataRet.data.last_name,
    is_admin: userDataRet.data.is_admin,
    roles: []
  };
  const userRolesData = await getUserGroups(email as string);
  for (let i = 0; i < userRolesData.data.length; i++) {
    userData.roles.push(userRolesData.data[i].name);
  }

  const groups = await getGroups();

  return {
    props: { userData: userData, groups: groups.data, }
  }
};


export default DashboardUserEditPage;
