import { useRouter } from "next/router";
import RootLayout from "@/pages/layout";
import { ReactElement, useEffect, useState } from "react";
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { Alert, Container, Snackbar, Typography } from "@mui/material";
import CreateUser from "@/components/Dashboard/UsersRoles/Users/CreateUser";
import EditableContentWrapper, {
  PrimaryButtonAction,
} from "@/components/Dashboard/Generic/EditableContentWrapper";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import { PermissionProvider } from "@/utils/context/permission";
import { useSnackbarState } from "@/utils/snackbar";
import { useUser } from "@/utils/context/user";
import { NextApiRequest, NextApiResponse } from "next";
import { userDetailAPI } from "@/pages/api/user/detail";

const DashboardUserAddPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);

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
  }, [email, password]);

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <PermissionProvider allowedPermissions={["user_add_permission"]}>
          <EditableContentWrapper
            primaryButtonTitle={PrimaryButtonAction.Create}
            preventNavigation={preventNavigation}
            setPreventNavigation={setPreventNavigation}
            onButtonClick={async () => {
              await setPreventNavigation(false);
              await fetch("/api/user/users", {
                method: "POST",
                body: JSON.stringify({
                  email: email,
                  password: password,
                }),
              })
                .then((res: any) => {
                  setPreventNavigation(false);
                  console.log(preventNavigation);
                  setSnackbar({
                    open: true,
                    message: "User created successfully",
                    severity: "success",
                  });
                  router.push("/dashboard/users-roles");
                })
                .catch((err: any) => {
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
              title="Create User"
              returnPath={"/dashboard/users-roles"}
            />
            <CreateUser
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
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

DashboardUserAddPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps = async (context: any) => {
  const { req, res } = context;
  const user = await userDetailAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse,
  )

  if (user.is_staff === false) {
    return {
      notFound: true,
    }
  }

  return { props: {} };
};


export default DashboardUserAddPage;
