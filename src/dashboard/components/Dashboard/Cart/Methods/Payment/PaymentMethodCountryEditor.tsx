// nextjs
// react
import { useState } from "react";
// components
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
// libs
// mui
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
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
  GridRowId,
  GridRowParams,
  MuiEvent,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { randomId } from "@mui/x-data-grid-generator";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
// types
import { IPaymentMethod, IPaymentMethodCountry } from "@/types/cart/methods";
import { ICountry, IVatGroup } from "@/types/country";
import { ICurrency } from "@/types/localization";

interface IPaymentMethodCountryTable extends IPaymentMethodCountry {
  isNew: boolean;
  valid: boolean;
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (
      oldModel: IPaymentMethodCountryTable
    ) => IPaymentMethodCountryTable
  ) => void;
  productTypeId: number;
}

const EditToolbar = (props: EditToolbarProps) => {
  const { setRows, setRowModesModel, productTypeId } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, product_type: productTypeId, isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add
      </Button>
    </GridToolbarContainer>
  );
};

interface IPaymentMethodCountryEditorProps {
  countries: ICountry[];
  vatGroups: IVatGroup[];
  paymentMethod: IPaymentMethod;
  paymentMethodCountries: IPaymentMethodCountry[];
  currencies: ICurrency[];
}

const PaymentMethodCountryEditor = ({
  countries,
  vatGroups,
  paymentMethod,
  paymentMethodCountries,
  currencies,
}: IPaymentMethodCountryEditorProps) => {
  console.log("paymentMethodCountries", paymentMethodCountries);

  const [rows, setRows] = useState<IPaymentMethodCountryTable[]>(
    paymentMethodCountries.map((smc) => ({
      ...smc,
      isNew: false,
      valid: true,
    }))
  );
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);

  const validateRow = (row: IPaymentMethodCountryTable) => {
    if (!row.price) {
      setSnackbar({
        open: true,
        message: "Price is required",
        severity: "error",
      });
      return false;
    }
    if (!row.vat_group) {
      setSnackbar({
        open: true,
        message: "VAT Group is required",
        severity: "error",
      });
      return false;
    }
    if (!row.currency) {
      setSnackbar({
        open: true,
        message: "Currency is required",
        severity: "error",
      });
      return false;
    }
    if (!row.country) {
      setSnackbar({
        open: true,
        message: "Country is required",
        severity: "error",
      });
      return false;
    }
    if (row.price < 0) {
      setSnackbar({
        open: true,
        message: "Price must be greater than 0",
        severity: "error",
      });
      return false;
    }
    return true;
  };

  const processRowUpdate = (
    newRow: IPaymentMethodCountryTable,
    oldRow: IPaymentMethodCountryTable
  ) => {
    if (!validateRow(newRow)) {
      throw new Error("Invalid row");
    }

    const updatedRow = { ...newRow, isNew: false };
    console.log("updatedRow", updatedRow);

    // if row is new, save it to the database
    if (newRow.isNew) {
      console.log("newRow", newRow);
      fetch(`/api/cart/payment-method/${paymentMethod.id}/country`, {
        method: "POST",
        body: JSON.stringify({
          payment_method: paymentMethod.id,
          country: newRow.country,
          vat_group: newRow.vat_group,
          currency: newRow.currency,
          price: newRow.price,
          is_active: newRow.is_active,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setSnackbar({
            open: true,
            message: "Variant created",
            severity: "success",
          });
          // get id from response and update row,
          console.log("data", data);
          if (data.error) throw new Error(data.error);
          const { id } = data;
          // remove row with newRow.id from rows and add row with id from response
          setRows((rows) => [
            ...rows.filter((row) => row.id !== newRow.id),
            { ...updatedRow, id },
          ]);
        });
      return updatedRow;
    }

    // // if row is not new, update it in the database and update the row in the grid
    fetch(
      `/api/cart/payment-method/${paymentMethod.id}/country/${newRow.id}/`,
      {
        method: "PUT",
        body: JSON.stringify({
          payment_method: paymentMethod.id,
          country: newRow.country,
          vat_group: newRow.vat_group,
          currency: newRow.currency,
          price: newRow.price,
          is_active: newRow.is_active,
        }),
      }
    )
      .then((res) => res.json())
      .then(() => {
        setSnackbar({
          open: true,
          message: "Variant updated",
          severity: "success",
        });
        // update row in the grid
        setRows((rows) => [
          ...rows.filter((row) => row.id !== newRow.id),
          updatedRow,
        ]);
      });

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

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
    // get row by id

    const row = rows.find((row) => row.id === id);
    console.log("rows", rows, row);
    if (!row) return;
    // open variant editor page with SKU
    if (!validateRow(row)) {
      return;
    }
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    // delete row with id
    fetch(`/api/cart/payment-method/${paymentMethod.id}/country/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setSnackbar({
          open: true,
          message: "Variant deleted",
          severity: "success",
        });
        // remove row with id from rows
        setRows((rows) => rows.filter((row) => row.id !== id));
      });
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

  const columns: GridColDef[] = [
    {
      // this should be a select field with countries
      field: "country",
      headerName: "Country",
      type: "singleSelect",
      valueOptions: countries?.map((country: ICountry) => ({
        value: country.code,
        label: country.name,
      })),
      editable: true,
      width: 125,
      minWidth: 150,
      maxWidth: 200,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      editable: true,
      width: 125,
      minWidth: 150,
      maxWidth: 200,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "vat_group",
      headerName: "VAT Group",
      type: "singleSelect",
      editable: true,
      width: 125,
      minWidth: 150,
      maxWidth: 200,
      sortable: false,
      disableColumnMenu: true,
      valueOptions: vatGroups?.map((vatGroup: IVatGroup) => ({
        value: vatGroup.id,
        label: `${vatGroup.name} (${vatGroup.rate} %)`,
      })),
    },
    {
      field: "currency",
      headerName: "Currency",
      type: "singleSelect",
      editable: true,
      width: 125,
      minWidth: 150,
      maxWidth: 200,
      sortable: false,
      disableColumnMenu: true,
      valueOptions: currencies?.map((currency: ICurrency) => ({
        value: currency.code,
        label: `${currency.symbol}`,
      })),
    },
    {
      field: "is_active",
      headerName: "Active",
      type: "boolean",
      editable: true,
      width: 125,
      minWidth: 150,
      maxWidth: 200,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 125,
      minWidth: 150,
      maxWidth: 200,
      cellClassName: "actions",

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
    <EditorCard>
      <CollapsableContentWithTitle title="Country variants">
        <Box>
          <DataGrid
            rows={rows}
            columns={columns}
            density={"compact"}
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
            sx={{ overflowX: "scroll" }}
          />
        </Box>
      </CollapsableContentWithTitle>
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
    </EditorCard>
  );
};

export default PaymentMethodCountryEditor;
