import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
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

import { Alert, Button, Card, Snackbar, Tooltip } from "@mui/material";
import { axiosPrivate } from "@/utils/axiosPrivate";
import { deleteUser } from "@/api/users-roles/users";

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

const getUsers = async () => {
  const users: IUser[] = [];
  const usrs = await axiosPrivate.get(`/user/users`);

  for (const user of usrs.data) {
    users.push({
      email: user["email"],
      first_name: user["first_name"],
      last_name: user["last_name"],
      is_admin: user["is_admin"],
      roles: [],
    });
    const userRoles = await axiosPrivate.get(
      `roles/user-groups/${user["email"]}`
    );
    for (const role of userRoles.data) {
      users[users.length - 1].roles.push(role.name);
    }
  }
  return {
    users: users || [],
  };
};

const UsersGrid = () => {
  const router = useRouter();
  const [users, setUsers] = useState<IUser[]>([]);
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
    getUsers().then((data) => {
      setUsers(data.users);
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
            onClick={() => {
              deleteUser(row.email)
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
        rows={users}
        columns={columns}
        autoHeight={true}
        onPaginationModelChange={setPaginationModel}
        paginationModel={paginationModel}
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
