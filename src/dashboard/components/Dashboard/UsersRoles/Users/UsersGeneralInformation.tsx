import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";
import { useState } from "react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRenderCellParams,
  GridToolbarContainer,
} from "@mui/x-data-grid";

import { IUser } from "@/types/user";

import { Alert, Button, Card, Snackbar } from "@mui/material";
import { axiosPrivate } from "@/utils/axiosPrivate";
import { usePermission } from "@/utils/context/permission";

const PAGE_SIZE = 30;

const EditToolbar = (props: any) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/users-roles/add-user`);
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add new
      </Button>
    </GridToolbarContainer>
  );
};

const getUsers = async (page: number, pageSize: number) => {
  console.log("getUsers", page, pageSize);
  const usersResult = await fetch(
    `/api/user/users/?page=${page}&limit=${pageSize}`,
    {
      method: "GET",
    }
  ).then((res) => res.json());

  const users = usersResult["results"];
  for (let user of users) {
    user.roles = [];
    if (user.is_admin) {
      user.roles.push("Admin");
    }

    const userRoles = await fetch(`/api/roles/user/${user.email}`, {
      method: "GET",
    }).then((res) => res.json());

    for (const role of userRoles) {
      user.roles.push(role.name);
    }
  }
  return {
    users: users || [],
  };
};

interface IUsersGridProps {
  users: IUser[];
}

const UsersGrid = ({ users }: IUsersGridProps) => {
  const router = useRouter();
  const [usersState, setUsersState] = useState<IUser[]>(users);
  const [paginationModel, setPaginationModel] = useState<{
    page: number;
    pageSize: number;
  }>({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);
  const { hasPermission } = usePermission();

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar(null);
  };

  const fetchUsers = async () => {
    getUsers(paginationModel?.page, paginationModel?.pageSize).then((data) => {
      setUsersState(data.users);
    });
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "email",
      headerName: "Email",
      editable: false,
      maxWidth: 200,
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
    },
    {
      field: "first_name",
      headerName: "First Name",
      editable: false,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "last_name",
      headerName: "Last Name",
      editable: false,
      flex: 1,
      type: "image",
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "is_admin",
      headerName: "Is Admin",
      editable: false,
      maxWidth: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) =>
        params?.row?.is_admin ? (
          <CheckCircleRoundedIcon />
        ) : (
          <CancelRoundedIcon />
        ),
    },
    {
      field: "roles",
      headerName: "Roles",
      editable: false,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueParser: (params) => {
        return params.value.join(", ");
      },
    },
    {
      field: "actions",
      align: "right",
      headerAlign: "right",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      flex: 1,
      disableColumnMenu: true,
      getActions: ({ row }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            disabled={!hasPermission}
            className="textPrimary"
            onClick={() => {
              router.push(`/dashboard/users-roles/edit-user/${row.email}`);
            }}
            color="inherit"
            key={"edit"}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            disabled={!hasPermission}
            onClick={async () => {
              fetch(`/api/user/users/${row.email}`, {
                method: "DELETE",
              })
                .then((res) => {
                  setSnackbar({
                    open: true,
                    message: "User deleted",
                    severity: "success",
                  });
                  fetchUsers();
                })
                .catch((err) => {
                  setSnackbar({
                    open: true,
                    message: "Error deleting user",
                    severity: "error",
                  });
                });
            }}
            color="inherit"
            key={"delete"}
          />,
        ];
      },
    },
  ];

  return (
    <Card elevation={0}>
      <DataGrid
        rows={usersState}
        columns={columns}
        pageSizeOptions={[PAGE_SIZE, 60, 90]}
        autoHeight={true}
        onPaginationModelChange={setPaginationModel}
        paginationModel={paginationModel}
        // rowCount={count}
        // loading={isLoading}
        paginationMode="server"
        disableRowSelectionOnClick
        getRowHeight={() => "auto"}
        getRowId={(row) => row.email}
        slots={{
          toolbar: EditToolbar,
        }}
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
    </Card>
  );
};

export default UsersGrid;
