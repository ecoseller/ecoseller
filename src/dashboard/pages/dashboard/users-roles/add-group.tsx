import { useRouter } from "next/router";
import RootLayout from "@/pages/layout";
import { ReactElement, useEffect, useState } from "react";
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { Alert, Container, Snackbar, Typography } from "@mui/material";
import EditableContentWrapper, {
  PrimaryButtonAction,
} from "@/components/Dashboard/Generic/EditableContentWrapper";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import { IPermission, IGroup } from "@/types/user";
import CreateRole from "@/components/Dashboard/UsersRoles/Roles/CreateRole";
import { permissionsAPI } from "@/pages/api/roles/permissions";
import { NextApiRequest, NextApiResponse } from "next";
import { PermissionProvider } from "@/utils/context/permission";
import { useSnackbarState } from "@/utils/snackbar";

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
  }, [group]);

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <PermissionProvider allowedPermissions={["group_add_permission"]}>
          <EditableContentWrapper
            primaryButtonTitle={PrimaryButtonAction.Create}
            preventNavigation={preventNavigation}
            setPreventNavigation={setPreventNavigation}
            onButtonClick={async () => {
              await setPreventNavigation(false);
              await fetch("/api/roles/groups", {
                method: "POST",
                body: JSON.stringify({
                  name: group.name,
                  description: group.description,
                  permissions: group.permissions.map((p) => {
                    return p.name;
                  }),
                }),
              })
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
            checkPermission={true}
          >
            <TopLineWithReturn
              title="Add Role"
              returnPath="/dashboard/users-roles"
            />
            <CreateRole
              group={group}
              setGroup={setGroup}
              permissions={permissions}
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

DashboardGroupAddPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps = async (context: any) => {
  const { req, res } = context;
  const permissions = await permissionsAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: { permissions: permissions },
  };
};

export default DashboardGroupAddPage;
