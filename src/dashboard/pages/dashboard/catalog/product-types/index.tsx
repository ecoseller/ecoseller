// /dashboard/catalog/products-types

// next.js
import { useRouter } from "next/router";

// libraries
import useSWR from "swr";

// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { ReactElement, useEffect, useState } from "react";
import RootLayout from "@/pages/layout";
// components
// mui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbarContainer,
  GridRowModes,
  GridRowModesModel,
  GridActionsCellItem,
  GridEventListener,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
// types
import { IProductType } from "@/types/product";
// api
import { deleteProductType, postProductType } from "@/api/product/types";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { productTypeListAPI } from "@/pages/api/product/type";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: IProductType) => IProductType
  ) => void;
}

const EditToolbar = (props: EditToolbarProps) => {
  const { setRows, setRowModesModel } = props;
  const router = useRouter();

  const handleClick = () => {
    // post new row with empty name and obtain ID and set it
    const newRow = {
      name: "",
      allowed_attribute_types_ids: [],
    };
    fetch("/api/product/type", {
      method: "POST",
      body: JSON.stringify(newRow),
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          // setRows((oldRows) => [
          //   ...oldRows,
          //   {
          //     ...newRow,
          //     id: data.id,
          //   },
          // ]);
          // setRowModesModel((oldModel) => ({
          //   ...oldModel,
          //   [data.id]: GridRowModes.Edit,
          // }));
          router.push(`/dashboard/catalog/product-types/${data.id}`);
        });
      }
    });
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add new
      </Button>
    </GridToolbarContainer>
  );
};

interface IDashboardProductTypesPageProps {
  productTypesData: IProductType[];
}

const DashboardProductTypesPage = ({
  productTypesData,
}: IDashboardProductTypesPageProps) => {
  const [rows, setRows] = useState<IProductType[]>(productTypesData || []);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  console.log("productTypesData", productTypesData);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar(null);
  };

  const router = useRouter();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "name",
      editable: false,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "create_at",
      headerName: "Created",
      editable: false,
      flex: 1,
    },
    {
      field: "update_at",
      headerName: "Last update",
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
              router.push(`/dashboard/catalog/product-types/${id}`);
            }}
            color="inherit"
            key={"edit"}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => {
              fetch(`/api/product/type/${id}`, {
                method: "DELETE",
              }).then((res) => {
                if (res.ok) {
                  setSnackbar({
                    open: true,
                    message: "Product type deleted",
                    severity: "success",
                  });
                  setRows((oldRows) => {
                    const newRows = oldRows.filter((row) => row.id !== id);
                    return newRows;
                  });
                }
              });
            }}
            color="inherit"
            key={"delete"}
          />,
        ];
      },
    },
  ];
  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Product types
          </Typography>
        </Stack>
        <Card elevation={0}>
          <DataGrid
            rows={rows}
            columns={columns}
            density={"compact"}
            editMode={"row"}
            hideFooter={true}
            autoHeight={true}
            rowModesModel={rowModesModel}
            onRowEditStop={handleRowEditStop}
            // processRowUpdate={processRowUpdate}
            slots={{
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
          />
        </Card>
      </Container>
    </DashboardLayout>
  );
};

DashboardProductTypesPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const productTypesData = await productTypeListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      productTypesData,
    },
  };
};

export default DashboardProductTypesPage;
