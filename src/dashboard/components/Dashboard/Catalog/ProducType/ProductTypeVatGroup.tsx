// next.js
// react
import { ChangeEvent, useState } from "react";
// mui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
  GridCellParams,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { randomId } from "@mui/x-data-grid-generator";

// types
import {
  IProductType,
  ISetProductStateData,
  IProductTypeVatGroup,
} from "@/types/product";
import { ICountry } from "@/types/country";

interface IProductTypeVatGroupTable extends IProductTypeVatGroup {
  id: number;
  isNew: boolean;
  valid: boolean;
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: IProductTypeVatGroupTable) => IProductTypeVatGroupTable
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
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
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

interface IProductTypeVatGroupProps {
  state: IProductType;
  setState: (data: IProductType) => void;
  countries: ICountry[];
}
const ProductTypeVatGroup = ({
  state,
  setState,
  countries,
}: IProductTypeVatGroupProps) => {
  console.log("countries", countries);

  const productTypeId = state.id as number;

  const [rows, setRows] = useState<IProductTypeVatGroupTable[]>(
    state.vat_groups.map((row: IProductTypeVatGroup) => ({
      ...row,
      id: row.id as number,
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

  const processRowUpdate = (
    newRow: IProductTypeVatGroupTable,
    oldRow: IProductTypeVatGroupTable
  ) => {
    if (!newRow.country) {
      setSnackbar({
        open: true,
        message: "Country is required",
        severity: "error",
      });
      throw new Error("Country is required");
    }

    if (!newRow.vat) {
      setSnackbar({
        open: true,
        message: "Vat is required",
        severity: "error",
      });
      throw new Error("Vat is required");
    }
    if (
      isNaN(Number(newRow.vat)) ||
      Number(newRow.vat) < 0 ||
      Number(newRow.vat) > 100
    ) {
      setSnackbar({
        open: true,
        message: "Vat is invalid",
        severity: "error",
      });
      throw new Error("Vat is invalid");
    }

    const updatedRow = { ...newRow, isNew: false };
    console.log("updatedRow", updatedRow);

    // if row is new, save it to the database
    if (newRow.isNew) {
      console.log("newRow", newRow);
      fetch(`/api/product/type/vat-group/`, {
        method: "POST",
        body: JSON.stringify({
          country: newRow.country,
          vat: newRow.vat,
          product_type: newRow.product_type,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setSnackbar({
            open: true,
            message: "Vat group created",
            severity: "success",
          });
          // get id from response and update row
          const { id } = data;
          // remove row with newRow.id from rows and add row with id from response
          setRows((rows) => [
            ...rows.filter((row) => row.id !== newRow.id),
            { ...updatedRow, id },
          ]);
        });
      return updatedRow;
    }

    // if row is not new, update it in the database and update the row in the grid
    fetch(`/api/product/type/vat-group/${newRow.id}/`, {
      method: "PUT",
      body: JSON.stringify({
        country: newRow.country,
        vat: newRow.vat,
        product_type: newRow.product_type,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setSnackbar({
          open: true,
          message: "Vat group updated",
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
    // open edit mode for the row with sku
    // get row by id

    const row = rows.find((row) => row.id === id);
    console.log("rows", rows, row);
    if (!row) return;
    // open variant editor page with SKU
    if (!row.country) {
      setSnackbar({
        open: true,
        message: "Country is required",
        severity: "error",
      });
      return;
    }
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    // delete row with id
    fetch(`/api/product/type/vat-group/${id}/`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setSnackbar({
          open: true,
          message: "Vat group deleted",
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
      field: "vat",
      headerName: "Vat (%)",
      editable: true,
      width: 125,
      minWidth: 150,
      maxWidth: 200,
      sortable: false,
      disableColumnMenu: true,
    },
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
            icon={<OpenInNewIcon />}
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
      <Typography variant="h6">Vat groups</Typography>
      <Box mt={2}>
        <FormControl fullWidth>
          <Stack spacing={2}>
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
                toolbar: { setRows, setRowModesModel, productTypeId },
              }}
              sx={{ overflowX: "scroll" }}
            />
          </Stack>
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
        </FormControl>
      </Box>
    </EditorCard>
  );
};

export default ProductTypeVatGroup;
