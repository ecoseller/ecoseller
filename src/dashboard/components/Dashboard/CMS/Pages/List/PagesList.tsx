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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// types
import { TPage } from "@/types/cms";
import { deleteCMSPage, deleteFrontendPage } from "@/api/cms/page/page";
import DeleteDialog from "@/components/Dashboard/Generic/DeleteDialog";

interface PagesListProps {
  pages: TPage[];
}

const PAGE_SIZE = 30;
const ROW_HEIGHT = 50;

const PagesList = ({ pages }: PagesListProps) => {
  const router = useRouter();

  const [openDeleteDialog, setOpenDeleteDialog] = useState<number | undefined>(
    undefined
  );

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const rows = pages?.map((page) => {
    const translation = Object.values(page.translations);
    let title = "";
    if (translation.length > 0) {
      translation[0].title ? (title = translation[0].title) : (title = "");
    }

    return {
      id: page.id,
      title: title,
      resourcetype: page.resourcetype,
    };
  });

  console.log(pages);

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
      field: "resourcetype",
      headerName: "Type",
      editable: false,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        if (params?.row?.resourcetype == "PageCMS") {
          return "Page CMS";
        } else if (params?.row?.resourcetype == "PageFrontend") {
          return "Page Storefront";
        }
        return "";
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
      getActions: ({ id, row }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => {
              if (row?.resourcetype == "PageCMS") {
                router.push(`/dashboard/cms/pages/cms/${id}`);
              } else if (row?.resourcetype == "PageFrontend") {
                router.push(`/dashboard/cms/pages/storefront/${id}`);
              }
            }}
            color="inherit"
            key={"edit"}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            // onClick={async () => await handleDeleteClick(id as number)}
            onClick={() => {
              setOpenDeleteDialog(id as number);
            }}
            color="inherit"
            key={"delete"}
          />,
        ];
      },
    },
  ];

  const handleDeleteClick = async (id: number) => {
    const item = pages.find((page) => page.id === id);
    if (!item) return;
    if (item.resourcetype == "PageCMS") {
      await deleteCMSPage(id);
    } else if (item.resourcetype == "PageFrontend") {
      await deleteFrontendPage(id);
    }

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

export default PagesList;
