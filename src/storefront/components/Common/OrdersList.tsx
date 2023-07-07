// utils
import { useTranslation } from "next-i18next";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import { useRouter } from "next/router";
import { IOrderBasicInfo } from "@/types/order";
import NextLink from "next/link";
import MUILink from "@mui/material/Link";

interface IOrderListProps {
  orders: IOrderBasicInfo[];
}

export const OrderList = ({ orders }: IOrderListProps) => {
  const router = useRouter();

  const { t } = useTranslation("order");

  const columns: GridColDef[] = [
    {
      field: "token",
      headerName: `${t("order-id")}`,
      editable: false,
      flex: 1,
      renderCell: (params: any) => {
        return (
          <NextLink href={`/order/${params.value}`}>
            <MUILink>{params.value}</MUILink>
          </NextLink>
        );
      },
      minWidth: 300,
    },
    {
      field: "status",
      headerName: `${t("status")}`,
      editable: false,
      flex: 1,
      renderCell: (params: any) => {
        return <>{t(`order-status-${params.value}`)}</>;
      },
    },
    {
      field: "create_at",
      headerName: `${t("create-at")}`,
      editable: false,
      flex: 1,
    },
    {
      field: "items",
      headerName: `${t("items")}`,
      editable: false,
      flex: 1,
      valueParser: (params) => {
        return params.value.join(" | ");
      },
    },
  ];

  return (
    <DataGrid
      rows={orders}
      columns={columns}
      hideFooter
      autoHeight={true}
      getRowId={(row: any) => row.token}
    />
  );
};
