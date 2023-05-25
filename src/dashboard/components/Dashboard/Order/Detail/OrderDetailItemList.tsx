import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { ICart, ICartItem } from "@/types/cart/cart";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import imgPath from "@/utils/imgPath";
import { IOrderDetail } from "@/types/order";
import CollapsableContentWithTitle from "../../Generic/CollapsableContentWithTitle";
import EditorCard from "../../Generic/EditorCard";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridRowsProp,
  GridToolbarContainer,
  MuiEvent,
} from "@mui/x-data-grid";
import { ICountry, IVatGroup } from "@/types/country";
import { ICurrency } from "@/types/localization";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { randomId } from "@mui/x-data-grid-generator";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: ICartItemRow) => ICartItemRow
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

interface IOrderDetailItemListProps {
  cart: ICart;
}

interface ICartItemRow extends ICartItem {
  isNew: boolean;
  valid: boolean;
}

const OrderDetailItemList = ({ cart }: IOrderDetailItemListProps) => {
  const router = useRouter();
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const [rows, setRows] = useState<ICartItemRow[]>(
    cart.cart_items.map((ci) => ({
      ...ci,
      isNew: false,
      valid: true,
    }))
  );

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = (newRow: ICartItemRow, oldRow: ICartItemRow) => {
    return newRow;
    // if (!validateRow(newRow)) {
    //   throw new Error("Invalid row");
    // }
    //
    // const updatedRow = { ...newRow, isNew: false };
    // console.log("updatedRow", updatedRow);
    //
    // // if row is new, save it to the database
    // if (newRow.isNew) {
    //   console.log("newRow", newRow);
    //   fetch(`/api/cart/payment-method/${paymentMethod.id}/country`, {
    //     method: "POST",
    //     body: JSON.stringify({
    //       payment_method: paymentMethod.id,
    //       country: newRow.country,
    //       vat_group: newRow.vat_group,
    //       currency: newRow.currency,
    //       price: newRow.price,
    //       is_active: newRow.is_active,
    //     }),
    //   })
    //     .then((res) => res.json())
    //     .then((data) => {
    //       setSnackbar({
    //         open: true,
    //         message: "Variant created",
    //         severity: "success",
    //       });
    //       // get id from response and update row,
    //       console.log("data", data);
    //       if (data.error) throw new Error(data.error);
    //       const { id } = data;
    //       // remove row with newRow.id from rows and add row with id from response
    //       setRows((rows) => [
    //         ...rows.filter((row) => row.id !== newRow.id),
    //         { ...updatedRow, id },
    //       ]);
    //     });
    //   return updatedRow;
    // }
    // // if row is not new, update it in the database and update the row in the grid
    // fetch(
    //   `/api/cart/payment-method/${paymentMethod.id}/country/${newRow.id}/`,
    //   {
    //     method: "PUT",
    //     body: JSON.stringify({
    //       payment_method: paymentMethod.id,
    //       country: newRow.country,
    //       vat_group: newRow.vat_group,
    //       currency: newRow.currency,
    //       price: newRow.price,
    //       is_active: newRow.is_active,
    //     }),
    //   }
    // )
    //   .then((res) => res.json())
    //   .then(() => {
    //     setSnackbar({
    //       open: true,
    //       message: "Variant updated",
    //       severity: "success",
    //     });
    //     // update row in the grid
    //     setRows((rows) => [
    //       ...rows.filter((row) => row.id !== newRow.id),
    //       updatedRow,
    //     ]);
    //   });
    //
    // return updatedRow;
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
    const row = rows.find((row) => row.product_variant_name === id);
    if (!row) return;

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    // setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    // // delete row with id
    // fetch(`/api/cart/payment-method/${paymentMethod.id}/country/${id}`, {
    //   method: "DELETE",
    // })
    //   .then((res) => res.json())
    //   .then(() => {
    //     setSnackbar({
    //       open: true,
    //       message: "Variant deleted",
    //       severity: "success",
    //     });
    //     // remove row with id from rows
    //     setRows((rows) => rows.filter((row) => row.id !== id));
    //   });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    // setRowModesModel({
    //   ...rowModesModel,
    //   [id]: { mode: GridRowModes.View, ignoreModifications: true },
    // });
    //
    // const editedRow = rows.find((row) => row.id === id);
    // if (editedRow!.isNew) {
    //   setRows(rows.filter((row) => row.id !== id));
    // }
  };

  const columns: GridColDef[] = [
    {
      field: "product_variant_name",
      headerName: "Product variant name",
      minWidth: 200,
    },
    {
      field: "product_variant_sku",
      headerName: "SKU",
      minWidth: 200,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
    },
    {
      field: "total_price_net_formatted",
      headerName: "Total net price",
      minWidth: 150,
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

  return (
    <EditorCard>
      <CollapsableContentWithTitle title="Order items">
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
          getRowId={(row) => row.product_variant_name}
          sx={{ overflowX: "scroll" }}
        />
        <Grid container justifyContent="center" sx={{ my: 3 }}>
          <Grid item>
            <Typography variant="h6">
              Total price:&nbsp;{cart.total_price_net_formatted}
            </Typography>
          </Grid>
        </Grid>
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};

export default OrderDetailItemList;
