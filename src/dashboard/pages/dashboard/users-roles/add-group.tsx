import { useRouter } from "next/router";
import RootLayout from "@/pages/layout";
import { ReactElement, useEffect, useState } from "react";
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { Container, Typography } from "@mui/material";
import EditableContentWrapper, { PrimaryButtonAction } from "@/components/Dashboard/Generic/EditableContentWrapper";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import { createGroup, getPermissions } from "@/api/users-roles/users";
import { IPermission, IGroup } from "@/types/user";
import CreateRole from "@/components/Dashboard/UsersRoles/Roles/CreateRole";

interface IPermissionsProps {
  permissions: IPermission[];
}

const DashboardGroupAddPage = ({ permissions }: IPermissionsProps) => {
  const router = useRouter();

  const [group, setGroup] = useState<IGroup>({
    name: "",
    description: "",
    permissions: [],
  });

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
  }, [group]);

  console.log("PERMISSIONS", permissions)

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <EditableContentWrapper
          primaryButtonTitle={PrimaryButtonAction.Create}
          preventNavigation={preventNavigation}
          setPreventNavigation={setPreventNavigation}
          onButtonClick={async () => {
            await setPreventNavigation(false);
            await createGroup(group)
              .then((res: any) => {
                setPreventNavigation(false);
                console.log(preventNavigation);
                setSnackbar({
                  open: true,
                  message: "Group created successfully",
                  severity: "success",
                });
                router.push("/dashboard/users-roles");
              })
              .catch((err: any) => {
                setPreventNavigation(false);
                console.log(preventNavigation);
                setSnackbar({
                  open: true,
                  message: "Error creating group",
                  severity: "error",
                });
              });
          }}
          returnPath="/dashboard/users-roles"
        >
          <TopLineWithReturn
            title="Add Group"
            returnPath="/dashboard/users-roles"
          />
          <CreateRole
            group={group}
            setGroup={setGroup}
            permissions={permissions}
          />
        </EditableContentWrapper>
      </Container>
    </DashboardLayout >
  );
};

DashboardGroupAddPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps = async (context: any) => {

  const permissions = await getPermissions();

  return {
    props: { permissions: permissions.data },
  };
};

export default DashboardGroupAddPage;
