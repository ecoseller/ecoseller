// react
import React from "react";
// next
import { useRouter } from "next/router";
// mui
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import EditIcon from "@mui/icons-material/Edit";
// types
import { IPageCategory } from "@/types/cms";

interface PagesListProps {
  categories: IPageCategory[];
}

const PAGE_SIZE = 30;
const ROW_HEIGHT = 50;

const PageCategoriesList = ({ categories }: PagesListProps) => {
  const router = useRouter();

  const rows = categories?.map((category) => {
    const translation = Object.values(category.translations);
    let title = "";
    if (translation.length > 0) {
      translation[0].title ? (title = translation[0].title) : (title = "");
    }

    return {
      id: category.id,
      title: title,
    };
  });

  console.log(categories);

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
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      flex: 1,
      disableColumnMenu: true,
      getActions: ({ id, row }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => {
              router.push(`/dashboard/cms/categories/${id}`);
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
      rows={rows}
      columns={columns}
      hideFooter
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

export default PageCategoriesList;
