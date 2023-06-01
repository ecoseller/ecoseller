import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { ICart, ICartItem } from "@/types/cart/cart";
import { Grid } from "@mui/material";
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
import { deleteItem, updateItemQuantity } from "@/api/cart/cart";
import { useSnackbarState } from "@/utils/snackbar";
import SnackbarWithAlert from "@/components/Dashboard/Generic/SnackbarWithAlert";
import Box from "@mui/material/Box";
import { OrderStatus } from "@/types/order";
import { usePermission } from "@/utils/context/permission";

interface IOrderDetailItemListProps {
  cart: ICart;
  orderStatus: OrderStatus;
  recalculateOrderPrice: () => Promise<void>;
}

interface ICartItemRow extends ICartItem {
  isNew: boolean;
  valid: boolean;
  id: number;
}

const OrderDetailItemList = ({
  cart,
  recalculateOrderPrice,
  orderStatus,
}: IOrderDetailItemListProps) => {
  const [rowModes, setRowModes] = useState<GridRowModesModel>({});

  const [rows, setRows] = useState<ICartItemRow[]>(
    cart.cart_items.map((ci, index) => ({
      ...ci,
      isNew: false,
      valid: true,
      id: index,
    }))
  );

  const [snackbar, setSnackbar] = useSnackbarState();
  const { hasPermission } = usePermission();

  const getRowById = (id: GridRowId) => {
    return rows.find((i) => i.id == id);
  };

  const handleRowModesChange = (newRowModesModel: GridRowModesModel) => {
    setRowModes(newRowModesModel);
  };

  const canEditItems = [OrderStatus.Pending, OrderStatus.Processing].includes(
    orderStatus
  );

  const validateRow = (row: ICartItemRow) => {
    return row.quantity >= 1;
  };

  const processRowUpdate = (newRow: ICartItemRow, oldRow: ICartItemRow) => {
    if (!validateRow(newRow)) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Quantity must be >= 1",
      });
      throw new Error("Invalid row");
    }

    const updatedRow = { ...newRow, isNew: false };

    updateItemQuantity(
      cart.token,
      updatedRow.product_variant_sku,
      updatedRow.quantity
    ).then(() => {
      setRows((rows) => [
        ...rows.filter((row) => row.id != newRow.id),
        updatedRow,
      ]);
      recalculateOrderPrice().then(() =>
        setSnackbar({
          open: true,
          message: "Quantity updated",
          severity: "success",
        })
      );
    });

    return updatedRow;
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
    const row = getRowById(id);
    if (row?.product_variant_sku) {
      deleteItem(cart.token, row.product_variant_sku).then(() => {
        const remainingRows = rows.filter((row) => row.id != id);
        setRows(remainingRows);

        recalculateOrderPrice().then(() =>
          setSnackbar({
            open: true,
            message: "Item deleted",
            severity: "success",
          })
        );
      });
    }
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
  ];

  const actionsColumn = {
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
  };

  if (hasPermission && canEditItems) {
    columns.push(actionsColumn);
  }

  return (
    <>
      <EditorCard>
        <CollapsableContentWithTitle title="Order items">
          <Box sx={{ my: 3 }} />
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
            slotProps={{
              toolbar: { setRows, setRowModes },
            }}
            sx={{ overflowX: "scroll" }}
          />
          <Grid container justifyContent="center" sx={{ my: 3 }}>
            <Grid item>
              <Typography variant="h6">
                Total net price:&nbsp;{cart.total_price_net_formatted}
              </Typography>
            </Grid>
          </Grid>
        </CollapsableContentWithTitle>
      </EditorCard>
      {snackbar ? (
        <SnackbarWithAlert snackbarData={snackbar} setSnackbar={setSnackbar} />
      ) : null}
    </>
  );
};

export default OrderDetailItemList;
