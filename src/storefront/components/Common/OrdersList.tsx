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
        }
        // {
        //     field: "actions",
        //     type: "actions",
        //     headerName: "Actions",
        //     width: 100,
        //     cellClassName: "actions",
        //     flex: 1,
        //     disableColumnMenu: true,
        //     getActions: ({ id }) => {
        //         return [
        //             <GridActionsCellItem
        //                 icon={<EditIcon />}
        //                 label="Edit"
        //                 className="textPrimary"
        //                 onClick={() => {
        //                     router.push(`/dashboard/orders/${id}`);
        //                 }}
        //                 color="inherit"
        //                 key={"edit"}
        //             />,
        //         ];
        //     },
        // },
    ];

    return (
        <DataGrid
            rows={orders}
            columns={columns}
            hideFooter
            // pageSizeOptions={[PAGE_SIZE, 60, 90]}
            // initialState={{
            //   pagination: {
            //     paginationModel: {
            //       pageSize: PAGE_SIZE,
            //     },
            //   },
            // }}
            autoHeight={true}
            disableRowSelectionOnClick
            getRowId={(row: any) => row.token}
        />
    );
};
