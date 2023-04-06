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
// types
import { ICurrency } from "@/types/localization";
import {
  deleteCurrency,
  postCurrency,
  putCurrency,
} from "@/api/country/country";

interface ICurrencyTable extends ICurrency {
  isNew?: boolean;
  id: string;
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: ICurrencyTable) => ICurrencyTable
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
        Add currency
      </Button>
    </GridToolbarContainer>
  );
};

const DashboardCurrencyPage = () => {
  const {
    data: currencies,
    error: currenciesError,
    mutate,
  } = useSWR<ICurrency[]>("/country/currency/");

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);

  useEffect(() => {
    if (currenciesError) {
      setSnackbar({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    }
  }, [currenciesError]);

  useEffect(() => {
    if (currencies) {
      setRows(
        currencies.map((currency: ICurrency) => ({
          ...currency,
          id: currency.code,
        }))
      );
    }
  }, [currencies]);

  const [rows, setRows] = useState<ICurrencyTable[]>([]);

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
      field: "symbol",
      headerName: "Symbol",
      editable: true,
      flex: 1,
      // sortable: false,
      // disableColumnMenu: true,
    },
    {
      field: "symbol_position",
      headerName: "Symbol position",
      editable: true,
      flex: 1,
      type: "singleSelect",
      valueOptions: [
        { value: "BEFORE", label: "Before price" },
        { value: "AFTER", label: "After price" },
      ],
      // sortable: false,
      // disableColumnMenu: true,
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
      deleteCurrency(deletedRow.code)
        .then(() => {
          setSnackbar({
            open: true,
            message: "Currency deleted successfully",
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

  const processRowUpdate = (newRow: ICurrencyTable, oldRow: ICurrencyTable) => {
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

    // POST or PUT
    if (updatedRow && !postNew) {
      // update currency
      putCurrency(updatedRow as ICurrency)
        .then(() => {
          setSnackbar({
            open: true,
            message: "Currency updated successfully",
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
      postCurrency(updatedRow as ICurrency)
        .then(() => {
          setSnackbar({
            open: true,
            message: "Currency created successfully",
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
            Currencies
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

DashboardCurrencyPage.getLayout = (page: ReactElement) => {
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

export default DashboardCurrencyPage;
