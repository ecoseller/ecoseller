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
import EditIcon from "@mui/icons-material/Edit";
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
import useSWRImmutable from "swr/immutable";

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
import { useSnackbarState } from "@/utils/snackbar";
import { ILanguage } from "@/types/localization";
import DeleteDialog from "../../Generic/DeleteDialog";

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
  attributeTypeValueType: TAttributeTypeValueType;
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
  attributeTypeValueType,
  baseAttributes,
  setState,
}: IBaseAttributeGridProps) => {
  const { data: languages } = useSWRImmutable<ILanguage[]>(
    "/api/country/language/"
  );

  const deserializeTranslations = (object: any) => {
    if (attributeTypeValueType !== "TEXT") return {};
    const deserializedTranslations: any = {};
    Object.keys(object?.translations)?.forEach((key: string) => {
      deserializedTranslations[`$NAME_${key}`] =
        object?.translations[key]?.name || "";
    });
    return deserializedTranslations;
  };

  const serializeTranslations = (object: any) => {
    const serializedTranslations: any = {};
    if (attributeTypeValueType == "TEXT") {
      // for text attributes, set names (for each language)
      languages?.forEach((language) => {
        serializedTranslations[language.code] = {
          name: object[`$NAME_${language.code}`] || "",
        };
      });
    } else {
      // for non-text attributes, set empty names
      languages?.forEach((language) => {
        serializedTranslations[language.code] = { name: null };
      });
    }
    return serializedTranslations;
  };

  const [rows, setRows] = useState<IBaseAttributeTable[]>(
    // filter out rows that are not yet saved to the database (have no ID) and map them to the correct type (id is a number)
    baseAttributes
      .filter((row: IBaseAttribute) => typeof row.id == "number")
      .map((row: IBaseAttribute) => ({
        ...row,
        id: row.id as number,
        isNew: false,
        valid: true,
        ...(attributeTypeValueType === "TEXT"
          ? // check translations field and set it in the format $NAME_${LANGUAGE_CODE} for each language
            deserializeTranslations(row)
          : {}),
      }))
  );

  // console.log(
  //   "baseAttributes",
  //   rows,
  //   baseAttributes
  //     .filter((row: IBaseAttribute) => typeof row.id == "number")
  //     .map((row: IBaseAttribute) => ({
  //       ...row,
  //       id: row.id as number,
  //       isNew: false,
  //       valid: true,
  //       ...(attribtueTypeValueType === "TEXT"
  //         ? // check translations field and set it in the format $NAME_${LANGUAGE_CODE} for each language
  //           deserializeTranslations(row)
  //         : {}),
  //     }))
  // );

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [snackbar, setSnackbar] = useSnackbarState();

  const [openDelete, setOpenDelete] = useState<string | undefined>(undefined);

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
      attributeTypeValueType
    );
    if (!valid) {
      setSnackbar({
        open: true,
        message: `Value is not valid for this value type ${attributeTypeValueType.toLowerCase()}`,
        severity: "error",
      });
      throw new Error(
        `Value is not valid for this value type ${attributeTypeValueType}`
      );
    }

    const updatedRow = {
      ...newRow,
      isNew: false,
      translations: serializeTranslations(newRow),
    };

    console.log("updated row", updatedRow);

    // if row is new, save it to the database
    if (newRow.isNew) {
      postBaseAttribute({
        value: newRow.value,
        type: newRow.type,
        translations: serializeTranslations(newRow),
      } as IBaseAttributePostRequest)
        .then((res) => res.data)
        .then((data) => {
          setSnackbar({
            open: true,
            message: "Attribute created",
            severity: "success",
          });
          // get id from response and update row
          // const { id } = data;
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

  const handleDeleteClick = (id: GridRowId) => {
    console.log("delete", id);
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

  const handleOpenDeleteClick = (id: GridRowId) => () => {
    setOpenDelete(id as string);
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
    ...(languages && attributeTypeValueType === "TEXT"
      ? languages.map((language) => ({
          field: `$NAME_${language.code}`,
          headerName: `${language.code}`,
          editable: true,
          width: 125,
          minWidth: 150,
          maxWidth: 200,
          sortable: false,
          disableColumnMenu: true,
        }))
      : []),
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
            onClick={handleOpenDeleteClick(id)}
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
      <Typography variant="body2" color="textSecondary">
        If the attribute type is set as Text, it is allowed to set translation
        for the attribute values.
      </Typography>
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
      <DeleteDialog
        open={openDelete !== undefined}
        setOpen={() => setOpenDelete(undefined)}
        onDelete={async () => {
          handleDeleteClick(openDelete as GridRowId);
        }}
        text="this attribute type"
      />
    </EditorCard>
  );
};

export default BaseAttributeGrid;
