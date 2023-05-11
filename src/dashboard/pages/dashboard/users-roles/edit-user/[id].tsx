import { useRouter } from "next/router";
import RootLayout from "@/pages/layout";
import { ReactElement, useEffect, useState } from "react";
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { Alert, Container, Snackbar } from "@mui/material";
import { IGroup, IUser } from "@/types/user";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import {
  updateRoles,
} from "@/api/users-roles/users";
import EditableContentWrapper, {
  PrimaryButtonAction,
} from "@/components/Dashboard/Generic/EditableContentWrapper";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import UserGeneralInformation from "@/components/Dashboard/UsersRoles/Users/Editor/User/UserGeneralInformation";
import UserGroupsInformation from "@/components/Dashboard/UsersRoles/Users/Editor/User/UserGroupsInformation";
import { concreteUserAPI } from "@/pages/api/user/users/[email]";
import { userRoleAPI } from "@/pages/api/roles/user/[email]";
import { groupsAPI } from "@/pages/api/roles/groups";

interface IUserEditProps {
  userData: IUser;
  groups: IGroup[];
}

const DashboardUserEditPage = ({ userData, groups }: IUserEditProps) => {
  const router = useRouter();
  const { id } = router.query;

  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
  const [state, setState] = useState<IUser>(userData);

  const [snackbar, setSnackbar] = useSnackbarState();

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
            fetch(`/api/user/users/${state.email}`,
              {
                method: "PUT",
                body: JSON.stringify(state),
              })
              .then(async (res: any) => {
                console.log("body", JSON.stringify({
                  roles: state.roles,
                }));
                await fetch(`/api/roles/user/${state.email}`,
                  {
                    method: "PUT",
                    body: JSON.stringify({
                      roles: state.roles,
                    }),
                  })
                  .then((res: any) => {
                    if (res.ok) {
                      setSnackbar({
                        open: true,
                        message: "User updated",
                        severity: "success",
                      });
                    }
                  })
                  .catch((err: any) => {
                    console.log("updateUser", err);
                    setSnackbar({
                      open: true,
                      message: "Something went wrong",
                      severity: "error",
                    });
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
          {snackbar ? (
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
            >
              <Alert
                onClose={handleSnackbarClose}
                severity={snackbar.severity}
                sx={{ width: "100%" }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          ) : null}
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
  const { req, res } = context;
  const userDataRet = await concreteUserAPI(
    "GET",
    email as string,
    req as NextApiRequest,
    res as NextApiResponse
  );

  const userData: IUser = {
    email: userDataRet.email,
    first_name: userDataRet?.first_name || "",
    last_name: userDataRet?.last_nam || "",
    is_admin: userDataRet.is_admin,
    roles: [],
  };
  const userRolesData = await userRoleAPI(
    "GET",
    email as string,
    req as NextApiRequest,
    res as NextApiResponse
  )
  for (let i = 0; i < userRolesData?.length; i++) {
    userData.roles.push(userRolesData[i]?.name);
  }

  const groups = await groupsAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  )

  return {
    props: { userData: userData, groups: groups },
  };
};

export default DashboardUserEditPage;
