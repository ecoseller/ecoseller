// react
import React, { useState } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// types
import { IPageCategory } from "@/types/cms";
import { deletePageCategory } from "@/api/cms/category/category";
import DeleteDialog from "@/components/Dashboard/Generic/DeleteDialog";

interface PagesListProps {
  categories: IPageCategory[];
}

const PAGE_SIZE = 30;
const ROW_HEIGHT = 50;

const PageCategoriesList = ({ categories }: PagesListProps) => {
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };
  const [openDeleteDialog, setOpenDeleteDialog] = useState<number | undefined>(
    undefined
  );

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
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => setOpenDeleteDialog(id as number)}
            color="inherit"
            key={"delete"}
          />,
        ];
      },
    },
  ];

  const handleDeleteClick = async (id: number) => {
    await deletePageCategory(id);
    refreshData();
  };

  return (
    <>
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
      <DeleteDialog
        open={openDeleteDialog !== undefined}
        setOpen={() => setOpenDeleteDialog(undefined)}
        onDelete={async () => {
          if (openDeleteDialog === undefined) return;
          handleDeleteClick(openDeleteDialog);
        }}
        text="this product type"
      />
    </>
  );
};

export default PageCategoriesList;
