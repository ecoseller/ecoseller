import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { ICart, ICartItem } from "@/types/cart/cart";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";
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
  MuiEvent,
} from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";

interface IOrderDetailItemListProps {
  cart: ICart;
}

interface ICartItemRow extends ICartItem {
  isNew: boolean;
  valid: boolean;
  id: number;
}

const OrderDetailItemList = ({ cart }: IOrderDetailItemListProps) => {
  const router = useRouter();
  const [rowModes, setRowModes] = useState<GridRowModesModel>({});

  const [rows, setRows] = useState<ICartItemRow[]>(
    cart.cart_items.map((ci, index) => ({
      ...ci,
      isNew: false,
      valid: true,
      id: index,
    }))
  );

  const handleRowModesChange = (newRowModesModel: GridRowModesModel) => {
    setRowModes(newRowModesModel);
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
    setRowModes({ ...rowModes, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModes({ ...rowModes, [id]: { mode: GridRowModes.View } });
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
    setRowModes({
      ...rowModes,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const columns: GridColDef[] = [
    {
      field: "product_variant_name",
      headerName: "Product variant name",
      minWidth: 200,
      renderCell: (params) => (
        <Link
          href={`/dashboard/catalog/products/edit/${params.row.product_id}`}
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: "product_variant_sku",
      headerName: "SKU",
      minWidth: 200,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      align: "left", // for some reason, we need to manually set alignment, otherwise it's aligned to right
      headerAlign: "left",
      type: "number",
      editable: true,
      minWidth: 150,
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
        const isInEditMode = rowModes[id]?.mode === GridRowModes.Edit;

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
          rowModesModel={rowModes}
          onRowModesModelChange={handleRowModesChange}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModes },
          }}
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
