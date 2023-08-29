import { useRouter } from "next/router";
import RootLayout from "@/pages/layout";
import { ReactElement, useEffect, useState } from "react";
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { Alert, Container, Snackbar } from "@mui/material";
import { IGroup, IUser } from "@/types/user";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import EditableContentWrapper, {
  PrimaryButtonAction,
} from "@/components/Dashboard/Generic/EditableContentWrapper";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import UserGeneralInformation from "@/components/Dashboard/UsersRoles/Users/Editor/User/UserGeneralInformation";
import UserGroupsInformation from "@/components/Dashboard/UsersRoles/Users/Editor/User/UserGroupsInformation";
import { concreteUserAPI } from "@/pages/api/user/users/[email]";
import { userRoleAPI } from "@/pages/api/roles/user/[email]";
import { groupsAPI } from "@/pages/api/roles/groups";
import { PermissionProvider } from "@/utils/context/permission";
import { useSnackbarState } from "@/utils/snackbar";
import { useUser } from "@/utils/context/user";
import UserPasswordInformation from "@/components/Dashboard/UsersRoles/Users/Editor/User/UserPasswordInformation";

interface IUserEditProps {
  userData: IUser;
  groups: IGroup[];
}

const DashboardUserEditPage = ({ userData, groups }: IUserEditProps) => {
  const router = useRouter();
  const { id } = router.query;
  const { user, roles } = useUser();

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
      <Container maxWidth={false}>
        <PermissionProvider allowedPermissions={["user_change_permission"]}>
          <EditableContentWrapper
            primaryButtonTitle={PrimaryButtonAction.Save}
            preventNavigation={preventNavigation}
            setPreventNavigation={setPreventNavigation}
            onButtonClick={async () => {
              await setPreventNavigation(false);
              await fetch(`/api/user/users/${state.email}`, {
                method: "PUT",
                body: JSON.stringify(state),
              });
              await fetch(`/api/roles/user/${state.email}`, {
                method: "PUT",
                body: JSON.stringify({
                  roles: state.roles,
                }),
              })
                .then((res: any) => {
                  if (res.ok) {
                    console.log("SNACKBAR", snackbar);
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
            }}
            returnPath={"/dashboard/users-roles"}
            checkPermission={true}
          >
            <TopLineWithReturn
              title={`Edit user ${state?.email}`}
              returnPath={"/dashboard/users-roles"}
            />
            <UserGeneralInformation
              state={state}
              setState={(v: IUser) => setState(v)}
            />
            <UserPasswordInformation
              selfEdit={user?.email === state.email}
              email={state.email}
              snackbar={snackbar}
              setSnackbar={(v: any) => setSnackbar(v)}
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
        </PermissionProvider>
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
    last_name: userDataRet?.last_name || "",
    is_admin: userDataRet.is_admin,
    is_staff: userDataRet.is_staff,
    roles: [],
  };
  const userRolesData = await userRoleAPI(
    "GET",
    email as string,
    req as NextApiRequest,
    res as NextApiResponse
  );
  for (let i = 0; i < userRolesData?.length; i++) {
    userData.roles.push(userRolesData[i]?.name);
  }

  const groups = await groupsAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: { userData: userData, groups: groups },
  };
};

export default DashboardUserEditPage;
