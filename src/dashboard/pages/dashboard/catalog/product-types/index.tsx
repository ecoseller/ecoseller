// /dashboard/products

// libraries
import useSWR from "swr";

// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { ReactElement, useEffect, useState } from "react";
import RootLayout from "@/pages/layout";
// components
import ProductListTopLine from "@/components/Dashboard/Catalog/Products/List/TopLine";
import ProductListHead from "@/components/Dashboard/Catalog/Products/List/ProductListHead";
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
  GridRowParams,
  MuiEvent,
  GridEventListener,
  GridRowId,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { randomId } from "@mui/x-data-grid-generator";
import { Alert, Snackbar } from "@mui/material";
// types
import { ICurrency, IPriceList } from "@/types/localization";
import {
  deletePriceList,
  postPriceList,
  putPriceList,
} from "@/api/country/product/priceList";
import { IProductType } from "@/types/product";
import { Router, useRouter } from "next/router";
import { postProductType } from "@/api/product/types";

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
    postProductType(newRow)
      .then((res) => {
        setRows((oldRows) => [
          ...oldRows,
          {
            ...newRow,
            id: res.data.id,
          },
        ]);
        setRowModesModel((oldModel) => ({
          ...oldModel,
          [res.data.id]: GridRowModes.Edit,
        }));
        router.push(`/dashboard/catalog/product-types/${res.data.id}`);
      })
      .catch((err) => {
        console.log(err);
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

const DashboardProductTypesPage = () => {
  const {
    data: productTypesData,
    error: productTypesError,
    mutate: productTypesMutate,
  } = useSWR<IProductType[]>("/product/dashboard/type/");

  const [rows, setRows] = useState<IProductType[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const router = useRouter();

  console.log("currencies", rows);

  useEffect(() => {
    if (productTypesData) {
      setRows(
        productTypesData.map((type: IProductType) => ({
          ...type,
        }))
      );
    }
  }, [productTypesData]);

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
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
              key={"save"}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
              key={"cancel"}
            />,
          ];
        }
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
            onClick={handleDeleteClick(id)}
            color="inherit"
            key={"delete"}
          />,
        ];
      },
    },
  ];

  const handleEditClick = (id: GridRowId) => () => {
    // open edit mode for the row with sku
    // get row by id
    const row = rows.find((row) => row.id === id);
    if (!row) return;
    const dataToPost: IProductType = {
      name: row.name,
      allowed_attribute_types_ids: [],
    };

    postProductType(dataToPost).then((res) => {
      const data = res.data;
      if (data) {
        productTypesMutate();
      }
    });

    // open variant editor page with SKU

    // setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };
  const processRowUpdate = (newRow: IProductType, oldRow: IProductType) => {
    const updatedRow = { ...newRow };

    // check if row has SKU
    // if not, show error
    // if yes, save row
    console.log("newRow", newRow);

    return updatedRow;
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const deletedRow = rows.find((row) => row.id === id);
    setRows(rows.filter((row) => row.id !== id));
  };

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
            editMode={"cell"}
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

export const getServersideProps = async (context: any) => {
  console.log("Dashboard pricelists");
  return {
    props: {},
  };
};

export default DashboardProductTypesPage;
