import { useRouter } from "next/router";
import RootLayout from "@/pages/layout";
import { ReactElement, useEffect, useState } from "react";
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { Container, Typography } from "@mui/material";
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


  //setPreventNavigation(false);
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <EditableContentWrapper
          primaryButtonTitle={PrimaryButtonAction.Create} // To distinguish between create and update actions
          preventNavigation={preventNavigation}
          setPreventNavigation={setPreventNavigation}
          onButtonClick={async () => {
            await createUser(email, password)
              .then((res: any) => {
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
            setPreventNavigation(false);
          }}
          returnPath={"/dashboard/users-roles"}
        >
          <CreateUser
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword} />
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
