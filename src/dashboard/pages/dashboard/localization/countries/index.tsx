// /dashboard/products

// libraries
import useSWR from "swr";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { hasFlag } from "country-flag-icons";

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
import { ICurrency, IPriceList } from "@/types/localization";
import {
  deleteCurrency,
  postCurrency,
  putCurrency,
} from "@/api/country/country";
import { ICountry } from "@/types/country";
import { countryListAPI } from "@/pages/api/country";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { pricelistListAPI } from "@/pages/api/product/price-list";

interface ICountryTable extends ICountry {
  isNew?: boolean;
  id: string;
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: ICountryTable) => ICountryTable
  ) => void;
}

const EditToolbar = (props: EditToolbarProps) => {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, code: "", locale: "", name: "", isNew: true, pricelist: "" },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add country
      </Button>
    </GridToolbarContainer>
  );
};

interface IProps {
  countries: ICountry[];
  pricelists: IPriceList[];
}

const DashboardCountryPage = ({ countries, pricelists }: IProps) => {
  console.log("countries", countries);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);

  const [rows, setRows] = useState<ICountryTable[]>(
    countries.map((country: ICountry) => ({
      ...country,
      id: country.code,
    }))
  );

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  console.log("countries", rows);

  const columns: GridColDef[] = [
    {
      field: "flag",
      headerName: "",
      flex: 1,
      maxWidth: 50,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (params.row.code && hasFlag(params.row.code.toUpperCase())) {
          return getUnicodeFlagIcon(params.row.code.toUpperCase());
        }
        return null;
      },
    },
    {
      field: "code",
      headerName: "Code",
      editable: true,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "name",
      headerName: "Name",
      editable: true,
      flex: 1,
      // sortable: false,
      // disableColumnMenu: true,
    },
    {
      field: "locale",
      headerName: "Locale",
      editable: true,
      flex: 1,
      // sortable: false,
      // disableColumnMenu: true,
    },
    {
      field: "default_price_list",
      headerName: "Default pricelist",
      editable: true,
      flex: 1,
      type: "singleSelect",
      valueOptions: pricelists?.map((pricelist: IPriceList) => ({
        value: pricelist.code,
        label: pricelist.code,
      })),
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
      fetch(`/api/country/${deletedRow.code}/`, {
        method: "DELETE",
      })
        .then(() => {
          setSnackbar({
            open: true,
            message: "Country deleted successfully",
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

  const processRowUpdate = (newRow: ICountryTable, oldRow: ICountryTable) => {
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
    if (!updatedRow.locale) {
      setSnackbar({
        open: true,
        message: "Locale is required",
        severity: "error",
      });
      throw new Error("Code is required");
    }
    if (!updatedRow.default_price_list) {
      setSnackbar({
        open: true,
        message: "Price list is required",
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
      fetch(`/api/country/${updatedRow.code}/`, {
        method: "PUT",
        body: JSON.stringify(updatedRow as ICountry),
      })
        .then(() => {
          setSnackbar({
            open: true,
            message: "Country updated successfully",
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
      fetch(`/api/country/`, {
        method: "POST",
        body: JSON.stringify(updatedRow as ICountry),
      })
        .then(() => {
          setSnackbar({
            open: true,
            message: "Country created successfully",
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
            Countries
          </Typography>
        </Stack>
        <Card elevation={0}>
          <DataGrid
            rows={rows}
            columns={columns}
            editMode={"row"}
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

DashboardCountryPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  const countries = await countryListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  const pricelists = await pricelistListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      countries,
      pricelists,
    },
  };
};

export default DashboardCountryPage;
