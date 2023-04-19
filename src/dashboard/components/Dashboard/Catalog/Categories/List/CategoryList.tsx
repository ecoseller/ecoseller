import { ICategoryLocalized } from "@/types/category";
import React from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";

interface ICategoryListProps {
  categories: ICategoryLocalized[];
}

const PAGE_SIZE = 30;
const ROW_HEIGHT = 50;

const CategoryList = ({ categories }: ICategoryListProps) => {
  const router = useRouter();

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "#",
      editable: false,
      maxWidth: 100,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "title",
      headerName: "Title",
      editable: false,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "published",
      headerName: "Published",
      editable: false,
      maxWidth: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) =>
        params?.row?.published ? (
          <CheckCircleRoundedIcon />
        ) : (
          <CancelRoundedIcon />
        ),
    },
    {
      field: "update_at",
      headerName: "Updated at",
      editable: false,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
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
              router.push(`/dashboard/catalog/categories/edit/${id}`);
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
      rows={categories}
      columns={columns}
      pageSizeOptions={[PAGE_SIZE, 60, 90]}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: PAGE_SIZE,
          },
        },
      }}
      autoHeight={true}
      disableRowSelectionOnClick
      getRowHeight={() => ROW_HEIGHT}
    />
  );
};

export default CategoryList;
