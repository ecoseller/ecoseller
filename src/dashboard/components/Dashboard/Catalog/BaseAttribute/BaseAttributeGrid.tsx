// next.js
import { useRouter } from "next/router";
// react
import { useState } from "react";
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
// api
import {
  deleteBaseAttribtue,
  postBaseAttribute,
  putBaseAttribute,
} from "@/api/product/attributes";
// types
import {
  IBaseAttribute,
  IBaseAttributePostRequest,
  TAttributeTypeValueType,
} from "@/types/product";
import Tooltip from "@mui/material/Tooltip";

interface IBaseAttributeTable extends IBaseAttribute {
  id: number;
  isNew: boolean;
  valid: boolean;
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: IBaseAttributeTable) => IBaseAttributeTable
  ) => void;
  attributeTypeId: number;
}

const EditToolbar = (props: EditToolbarProps) => {
  const { setRows, setRowModesModel, attributeTypeId } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, value: "", type: attributeTypeId, isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add attribute
      </Button>
    </GridToolbarContainer>
  );
};

interface IBaseAttributeGridProps {
  attributeTypeId: number | undefined;
  baseAttributes: IBaseAttribute[];
  attribtueTypeValueType: TAttributeTypeValueType;
  setState: (data: IBaseAttribute[]) => void;
}

const validateValueAgainstValueType = (
  value: string,
  valueType: TAttributeTypeValueType
) => {
  let valid = false;
  switch (valueType) {
    case "INTEGER":
      valid = Number.isInteger(Number(value));
      console.log("valid integer?", valid, value, Number(value));
      break;
    case "DECIMAL":
      valid = !Number.isNaN(value);
      break;
    default:
      valid = true;
  }
  return valid;
};
const BaseAttributeGrid = ({
  attributeTypeId,
  attribtueTypeValueType,
  baseAttributes,
  setState,
}: IBaseAttributeGridProps) => {
  const [rows, setRows] = useState<IBaseAttributeTable[]>(
    // filter out rows that are not yet saved to the database (have no ID) and map them to the correct type (id is a number)
    baseAttributes
      .filter((row: IBaseAttribute) => typeof row.id == "number")
      .map((row: IBaseAttribute) => ({
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
    newRow: IBaseAttributeTable,
    oldRow: IBaseAttributeTable
  ) => {
    if (!newRow.value) {
      setSnackbar({
        open: true,
        message: "Value is required",
        severity: "error",
      });
      throw new Error("Value is required");
    }

    // check attribute type value type
    const valid = validateValueAgainstValueType(
      newRow.value,
      attribtueTypeValueType
    );
    if (!valid) {
      setSnackbar({
        open: true,
        message: `Value is not valid for this value type ${attribtueTypeValueType.toLowerCase()}`,
        severity: "error",
      });
      throw new Error(
        `Value is not valid for this value type ${attribtueTypeValueType}`
      );
    }

    const updatedRow = { ...newRow, isNew: false };

    // if row is new, save it to the database
    if (newRow.isNew) {
      postBaseAttribute({
        value: newRow.value,
        type: newRow.type,
      } as IBaseAttributePostRequest)
        .then((res) => res.data)
        .then((data) => {
          setSnackbar({
            open: true,
            message: "Attribute created",
            severity: "success",
          });
          // get id from response and update row
          const { id } = data;
          // remove row with newRow.id from rows and add row with id from response
          setRows((rows) => [
            ...rows.filter((row) => row.id !== newRow.id),
            updatedRow,
          ]);
        });
      return updatedRow;
    }

    // if row is not new, update it in the database and update the row in the grid
    putBaseAttribute(updatedRow as IBaseAttribute)
      .then((res) => res.data)
      .then((data) => {
        setSnackbar({
          open: true,
          message: "Attribute updated",
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
    if (!row.value) {
      setSnackbar({
        open: true,
        message: "Value is required",
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
    deleteBaseAttribtue(id as number)
      .then((res) => {
        setRows(rows.filter((row) => row.id !== id));
        setState(rows.filter((row) => row.id !== id));
        setSnackbar({
          open: true,
          message: "Attribute deleted",
          severity: "success",
        });
      })
      .catch((err) => {
        console.log(err);
        setSnackbar({
          open: true,
          message: "Error deleting attribute",
          severity: "error",
        });
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
      field: "value",
      headerName: "Value",
      editable: true,
      width: 125,
      minWidth: 150,
      maxWidth: 200,
      sortable: false,
      disableColumnMenu: true,
    },
    // {
    //   field: "valid",
    //   headerName: "Valid type",
    //   width: 125,
    //   minWidth: 150,
    //   maxWidth: 200,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params: GridCellParams) => {
    //     // const { valid } = params.row;
    //     const valid = validateValueAgainstValueType(
    //       params.row.value,
    //       attribtueTypeValueType
    //     );
    //     console.log("valid", valid, params.row.value, attribtueTypeValueType);
    //     return valid ? (
    //       <Tooltip title={"Value has correct type."}>
    //         <CheckCircleIcon className="textSuccess" />
    //       </Tooltip>
    //     ) : (
    //       <Tooltip
    //         title={`Value has incorrect type. Please provide value with type ${attribtueTypeValueType.toLowerCase()}`}
    //       >
    //         <CancelIcon className="textError" />
    //       </Tooltip>
    //     );
    //   },
    // },
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
      <Typography variant="h6">Attributes</Typography>
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
                toolbar: { setRows, setRowModesModel, attributeTypeId },
              }}
              experimentalFeatures={{ columnGrouping: true }} // <-- this enables column grouping (experimental)
              // columnGroupingModel={columnGroupingModel} // <-- this creates groupping for attributes, but it is not working properly :(
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

export default BaseAttributeGrid;
