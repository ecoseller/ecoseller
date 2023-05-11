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
import EditRole from "@/components/Dashboard/UsersRoles/Roles/EditRole";
import { concreteGroupAPI } from "@/pages/api/roles/groups/[role_name]";
import { NextApiRequest, NextApiResponse } from "next";
import { permissionsAPI } from "@/pages/api/roles/permissions";

interface IEditGroupProps {
  group: IGroup;
  permissions: IPermission[];
}

const DashboardGroupEditPage = ({ group, permissions }: IEditGroupProps) => {
  const router = useRouter();

  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
  const [groupState, setGroupState] = useState<IGroup>(group);

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
  }, [groupState]);

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <EditableContentWrapper
          primaryButtonTitle={PrimaryButtonAction.Save}
          preventNavigation={preventNavigation}
          setPreventNavigation={setPreventNavigation}
          onButtonClick={async () => {
            await setPreventNavigation(false);
            await fetch(`/api/roles/groups/${groupState.name}`, {
              method: "PUT",
              body: JSON.stringify(groupState),
            })
              .then((res: any) => {
                setPreventNavigation(false);
                console.log(preventNavigation);
                setSnackbar({
                  open: true,
                  message: "Group updated successfully",
                  severity: "success",
                });
                router.push("/dashboard/users-roles");
              })
              .catch((err: any) => {
                setPreventNavigation(false);
                console.log(preventNavigation);
                setSnackbar({
                  open: true,
                  message: "Error updating group",
                  severity: "error",
                });
              });
          }}
          returnPath="/dashboard/users-roles"
        >
          <TopLineWithReturn
            title="Edit Role"
            returnPath="/dashboard/users-roles"
          />
          <EditRole
            group={groupState}
            setGroup={setGroupState}
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
      </Container>
    </DashboardLayout>
  );
};

DashboardGroupEditPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps = async (context: any) => {
  const groupId = context?.params?.id;
  const { req, res } = context;

  const group = await concreteGroupAPI(
    "GET",
    groupId as string,
    req as NextApiRequest,
    res as NextApiResponse
  )

  const permissions = await permissionsAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      group: group,
      permissions: permissions,
    },
  };
};

export default DashboardGroupEditPage;
