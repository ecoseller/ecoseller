// /dashboard/products

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
import ClickAwayListener from "@mui/base/ClickAwayListener";
// types
import { ICurrency, IPriceList } from "@/types/localization";
import {
  deletePriceList,
  postPriceList,
  putPriceList,
} from "@/api/country/product/priceList";

interface IPriceListTable extends IPriceList {
  isNew?: boolean;
  id: string;
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: IPriceListTable) => IPriceListTable
  ) => void;
}

const EditToolbar = (props: EditToolbarProps) => {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, code: "", symbol: "", symbol_position: "AFTER", isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add price list
      </Button>
    </GridToolbarContainer>
  );
};

const DashboardPriceListsPage = () => {
  const {
    data: currencies,
    error: currenciesError,
    mutate: currenciesMutate,
  } = useSWR<ICurrency[]>("/country/currency/");

  const {
    data: priceLists,
    error: priceListsError,
    mutate: priceListsMutate,
  } = useSWR<IPriceList[]>("/product/dashboard/pricelist/");

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);

  useEffect(() => {
    if (priceListsError) {
      setSnackbar({
        open: true,
        message: "Something went wrong, could not fetch price lists",
        severity: "error",
      });
    }
  }, [priceListsError]);

  useEffect(() => {
    if (currenciesError) {
      setSnackbar({
        open: true,
        message: "Something went wrong, could not fetch currencies",
        severity: "error",
      });
    }
  }, [currenciesError]);

  useEffect(() => {
    if (priceLists) {
      setRows(
        priceLists.map((priceList: IPriceList) => ({
          ...priceList,
          id: priceList.code,
        }))
      );
    }
  }, [priceLists]);

  const [rows, setRows] = useState<IPriceListTable[]>([]);

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  console.log("currencies", rows);

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Code",
      editable: true,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "currency",
      headerName: "Currency",
      editable: true,
      type: "singleSelect",
      valueOptions: currencies?.map((currency) => ({
        label: currency.symbol,
        value: currency.code,
      })),
    },
    {
      field: "rounding",
      headerName: "Rounding",
      editable: true,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      type: "boolean",
    },
    {
      field: "is_default",
      headerName: "Is default",
      editable: true,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      type: "boolean",
    },
    {
      field: "includes_vat",
      headerName: "Incl. VAT",
      editable: true,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      type: "boolean",
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
            onClick={handleEditClick(id)}
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

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId) => () => {
    // open edit mode for the row with sku
    // get row by id
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const deletedRow = rows.find((row) => row.id === id);
    if (deletedRow && !deletedRow!.isNew) {
      deletePriceList(deletedRow.code)
        .then(() => {
          setSnackbar({
            open: true,
            message: "Price list deleted successfully",
            severity: "success",
          });
        })
        .catch(() => {
          setSnackbar({
            open: true,
            message: "Something went wrong",
            severity: "error",
          });
          throw new Error("Something went wrong");
        });
    }
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (
    newRow: IPriceListTable,
    oldRow: IPriceListTable
  ) => {
    const previousRows = oldRow;
    const updatedRow = { ...newRow, isNew: false };

    const postNew = oldRow && oldRow.isNew && !oldRow.code;

    // check if row has code
    // if not, show error
    // if yes, save row
    if (!updatedRow.code) {
      setSnackbar({
        open: true,
        message: "Code is required",
        severity: "error",
      });
      throw new Error("Code is required");
    }

    // check if there's duplicate code
    // if yes, show error
    // if no, save row
    const isDuplicateCode = rows.some(
      (row) => row.code === updatedRow.code && row.id !== updatedRow.id
    );
    if (isDuplicateCode) {
      setSnackbar({
        open: true,
        message: "Code already exists",
        severity: "error",
      });
      throw new Error("Code already exists");
    }

    // check if there's a duplicate default
    // if yes, show error
    // if no, save row
    const isDuplicateDefault = rows.some(
      (row) =>
        row.is_default === updatedRow.is_default && row.id !== updatedRow.id
    );

    if (isDuplicateDefault) {
      setSnackbar({
        open: true,
        message: "Default already exists",
        severity: "error",
      });
      throw new Error("Default already exists");
    }

    // POST or PUT
    if (updatedRow && !postNew) {
      // update currency
      putPriceList(updatedRow as IPriceList)
        .then(() => {
          setSnackbar({
            open: true,
            message: "Price list updated successfully",
            severity: "success",
          });
        })
        .catch(() => {
          setSnackbar({
            open: true,
            message: "Something went wrong",
            severity: "error",
          });
          throw new Error("Something went wrong");
        });
    } else {
      // create currency
      postPriceList(updatedRow as IPriceList)
        .then(() => {
          setSnackbar({
            open: true,
            message: "Price list created successfully",
            severity: "success",
          });
        })
        .catch(() => {
          setSnackbar({
            open: true,
            message: "Something went wrong",
            severity: "error",
          });
          throw new Error("Something went wrong");
        });
    }

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar(null);
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
            Price lists
          </Typography>
        </Stack>
        <Card elevation={0}>
          <DataGrid
            rows={rows}
            columns={columns}
            density={"compact"}
            editMode={"row"} //<-- changing this from "cell" to "row" made the edit mode finally properly work and not trigger every single select...
            hideFooter={true}
            autoHeight={true}
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
          />
        </Card>
      </Container>
      {snackbar ? (
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      ) : null}
    </DashboardLayout>
  );
};

DashboardPriceListsPage.getLayout = (page: ReactElement) => {
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

export default DashboardPriceListsPage;
