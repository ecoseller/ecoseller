// react
import React from "react";
// next
import { useRouter } from "next/router";
// mui
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
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
  GridRowModel,
  GridColumnGroupingModel,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import { randomId } from "@mui/x-data-grid-generator";
import { Alert, Snackbar } from "@mui/material";

// types
import { IPageCategoryType } from "@/types/cms";
import {
  createPageCategoryType,
  deletePageCategoryType,
  putPageCategoryType,
} from "@/api/cms/category/type/type";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";

interface IPageCategoryTypeTable extends IPageCategoryType {
  isNew: boolean;
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: IPageCategoryTypeTable) => IPageCategoryTypeTable
  ) => void;
}

const EditToolbar = (props: EditToolbarProps) => {
  const { setRows, setRowModesModel } = props;

  const handleClick = async () => {
    // create a new row on the server and get the id from the response

    const id = randomId();

    setRows((oldRows) => [...oldRows, { id, identifier: "", isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add category type
      </Button>
    </GridToolbarContainer>
  );
};

interface IPageTypeListProps {
  types: IPageCategoryType[];
}

const PageCategoryTypeList = ({ types }: IPageTypeListProps) => {
  const [rows, setRows] = useState<IPageCategoryTypeTable[]>(
    types as IPageCategoryTypeTable[]
  );
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);

  const columns: GridColDef[] = [
    {
      field: "identifier",
      headerName: "Name",
      width: 200,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",

      width: 200,
      disableColumnMenu: true,
      getActions: ({ id }: { id: any }) => {
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

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    deletePageCategoryType(id as number)
      .then((res) => {
        setSnackbar({
          open: true,
          message: "Category type deleted",
          severity: "success",
        });
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: "Error deleting category type",
          severity: "error",
        });
        console.log(err);
        throw new Error("Error deleting category type");
      });

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

  const processRowUpdate = async (
    newRow: IPageCategoryTypeTable,
    oldRow: IPageCategoryTypeTable
  ) => {
    console.log("handleSaveClickUpdate", newRow, oldRow);

    const updatedRow = { ...newRow, isNew: false };

    if (!updatedRow.identifier) {
      setSnackbar({
        open: true,
        message: "Name is required",
        severity: "error",
      });
      throw new Error("Name is required");
    }

    // check if the row has unique identifier
    const isUnique = rows.every(
      (row) =>
        row.identifier !== updatedRow.identifier || row.id === updatedRow.id
    );

    if (!isUnique) {
      setSnackbar({
        open: true,
        message: "Name must be unique",
        severity: "error",
      });
      throw new Error("Name must be unique");
    }

    // now call server to update the row
    // if oldRow is new, then call create endpoint and get the id from the response else just call update endpoint
    if (oldRow.isNew) {
      // create a new row on the server and get the id from the response
      const resp = await createPageCategoryType({
        identifier: updatedRow.identifier,
      } as IPageCategoryType);
      const { id } = resp;
      updatedRow.id = id;

      setSnackbar({
        open: true,
        message: "Category type created",
        severity: "success",
      });
    } else {
      // update the row on the server
      await putPageCategoryType(updatedRow.id, updatedRow as IPageCategoryType);
      setSnackbar({
        open: true,
        message: "Category type upated",
        severity: "success",
      });
    }
    // turn off the edit mode
    setRowModesModel({
      ...rowModesModel,
      [updatedRow.id]: { mode: GridRowModes.View },
      [oldRow.id]: { mode: GridRowModes.View },
    });

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
    <div style={{ marginTop: "20px", backgroundColor: "white" }}>
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
        experimentalFeatures={{ columnGrouping: true }} // <-- this enables column grouping (experimental)
        // columnGroupingModel={columnGroupingModel} // <-- this creates groupping for attributes, but it is not working properly :(
        sx={{ overflowX: "scroll" }}
      />
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
    </div>
  );
};

export default PageCategoryTypeList;
