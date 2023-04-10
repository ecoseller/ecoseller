import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
} from "@mui/x-data-grid";

import {
    IUser,
} from "@/types/user";

import OverflowTooltip from "@/components/Dashboard/Roles/OverflowTip";
import { Tooltip } from '@mui/material';
import { axiosPrivate } from '@/utils/axiosPrivate';

const PAGE_SIZE = 30;

const useUsers = async () => {
    const users: IUser[] = [];
    const usrs = await axiosPrivate.get(
        `/user/users`
    );

    // console.log(users.data);
    for (const user of usrs.data) {
        users.push({
            email: user['email'],
            first_name: user['first_name'],
            last_name: user['last_name'],
            is_admin: user['is_admin'],
            roles: []
        });
        const userRoles = await axiosPrivate.get(
            `roles/get-groups/${user['email']}`
        );
        for (const role of userRoles.data) {
            users[users.length - 1].roles.push(role.name);
        }
    }
    return {
        users: users || []
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

    React.useEffect(() => {
        useUsers().then((data) => {
            console.log("data: ", data);
            setUsers(data.users);
        })
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
                console.log("params", params);
                return params.value.join(", ");
            },
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            cellClassName: "actions",
            flex: 1,
            disableColumnMenu: true,
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={() => {
                            router.push(`/dashboard/catalog/products/edit/${id}`);
                        }}
                        color="inherit"
                        key={"edit"}
                    />,
                ];
            },
        },
    ];

    return (
        <DataGrid
            rows={users}
            columns={columns}
            autoHeight={true}
            disableRowSelectionOnClick
            getRowHeight={() => "auto"}
            getRowId={(row) => row.email}
        />
    );
};

export default UsersGrid;
