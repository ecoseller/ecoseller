import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridToolbarContainer,
} from "@mui/x-data-grid";

import { IGroup } from "@/types/user";

import { Alert, Button, Card, Snackbar, Tooltip } from "@mui/material";
import { axiosPrivate } from "@/utils/axiosPrivate";
import { deleteGroup } from "@/api/users-roles/users";
import { handleClientScriptLoad } from "next/script";
import { useSnackbarState } from "@/utils/snackbar";

const PAGE_SIZE = 30;

const EditToolbar = (props: any) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/users-roles/add-group`);
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add new
      </Button>
    </GridToolbarContainer>
  );
};

const getGroups = async () => {
  const groups: IGroup[] = [];
  const grps = await axiosPrivate.get(`/roles/groups`);

  for (const group of grps.data) {
    groups.push({
      name: group["name"],
      description: group["description"],
      permissions: group["permissions"],
    });
  }

  return {
    groups: groups || [],
  };
};

const GroupsGrid = () => {
  const router = useRouter();
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [paginationModel, setPaginationModel] = useState<{
    page: number;
    pageSize: number;
  }>({
    page: 0,
    pageSize: PAGE_SIZE,
  });
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

  const fetchGroups = async () => {
    getGroups().then((data) => {
      console.log("groups data: ", data);
      setGroups(data.groups);
    });
  };

  React.useEffect(() => {
    fetchGroups();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Group Name",
      editable: false,
      maxWidth: 200,
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      editable: false,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
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
              router.push(`/dashboard/users-roles/edit-group/${row.name}`);
            }}
            color="inherit"
            key={"edit"}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => {
              deleteGroup(row)
                .then((res) => {
                  setSnackbar({
                    open: true,
                    message: "Group deleted",
                    severity: "success",
                  });
                  fetchGroups();
                })
                .catch((err) => {
                  setSnackbar({
                    open: true,
                    message: "Error deleting group",
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
        rows={groups}
        columns={columns}
        autoHeight={true}
        disableRowSelectionOnClick
        getRowHeight={() => "auto"}
        getRowId={(row) => row.name}
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

export default GroupsGrid;
