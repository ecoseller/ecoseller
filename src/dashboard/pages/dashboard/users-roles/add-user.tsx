import { useRouter } from "next/router";
import RootLayout from "@/pages/layout";
import { ReactElement, useEffect, useState } from "react";
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { Alert, Container, Snackbar, Typography } from "@mui/material";
import CreateUser from "@/components/Dashboard/UsersRoles/Users/CreateUser"
import EditableContentWrapper, { PrimaryButtonAction } from "@/components/Dashboard/Generic/EditableContentWrapper";
import { createUser } from "@/api/users-roles/users";

const DashboardUserAddPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);

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
  }, [email, password]);

  console.log(email, password);
  console.log(preventNavigation);
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <EditableContentWrapper
          primaryButtonTitle={PrimaryButtonAction.Create}
          preventNavigation={preventNavigation}
          setPreventNavigation={setPreventNavigation}
          onButtonClick={async () => {
            await setPreventNavigation(false);
            await createUser(email, password)
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
        >
          <CreateUser
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword} />
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
    </DashboardLayout >
  );
};

DashboardUserAddPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default DashboardUserAddPage;
