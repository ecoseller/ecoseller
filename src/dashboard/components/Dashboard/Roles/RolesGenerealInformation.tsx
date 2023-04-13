import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import useSWR from "swr";
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

import { IUser, IPermission, IGroup } from "@/types/user";

import OverflowTooltip from "@/components/Dashboard/Roles/OverflowTip";
import { Button, Tooltip } from "@mui/material";
import { axiosPrivate } from "@/utils/axiosPrivate";
import { createUser, deleteGroup, deleteUser } from "@/api/users-roles/users";

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
  const grps = await axiosPrivate.get(`/roles/get-all-groups-detail`);

  for (const group of grps.data) {
    groups.push({
      group_name: group["name"],
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
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);

  React.useEffect(() => {
    getGroups().then((data) => {
      console.log("groups data: ", data);
      setGroups(data.groups);
    });
  }, []);

  const columns: GridColDef[] = [
    {
      field: "group_name",
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
              router.push(
                `/dashboard/users-roles/edit-group/${row.group_name}`
              );
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
    <DataGrid
      rows={groups}
      columns={columns}
      autoHeight={true}
      disableRowSelectionOnClick
      getRowHeight={() => "auto"}
      getRowId={(row) => row.group_name}
      slots={{
        toolbar: EditToolbar,
      }}
    />
  );
};

export default GroupsGrid;
