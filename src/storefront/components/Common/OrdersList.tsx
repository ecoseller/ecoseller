import { IOrder } from "@types/order"
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import { useRouter } from "next/router";

interface IOrderListProps {
    orders: IOrder[];
}

export const OrderList = ({ orders }: IOrderListProps) => {
    const router = useRouter();

    const columns: GridColDef[] = [
        {
            field: "token",
            headerName: "Order id",
            editable: false,
            flex: 1,
            renderCell: (params: any) => {
                return <span>{params.value}</span>;
            },
            minWidth: 300,
        },
        {
            field: "status",
            headerName: "Status",
            editable: false,
            flex: 1,
        },
        {
            field: "create_at",
            headerName: "Created at",
            editable: false,
            flex: 1,
        },
        {
            field: "items",
            headerName: "Items",
            editable: false,
            flex: 1,
            valueParser: (params) => {
                return params.value.join(" | ");
            },
        }
    ];

    return (
        <DataGrid
            rows={orders}
            columns={columns}
            hideFooter
            autoHeight={true}
            disableRowSelectionOnClick
            getRowId={(row: any) => row.token}
        />
    );
};
