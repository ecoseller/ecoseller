import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import { IPriceList } from "@/types/localization";
import {
  ActionSetProduct,
  IProductVariant,
  ISetProductStateData,
} from "@/types/product";
import {
  deserializeProductVariantAttributesToRow,
  deserializeProductVariantPricesToRow,
  serializeProductVariantPricesFromRow,
} from "@/utils/productSerializer";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import {
  GridColDef,
  GridEventListener,
  GridRowModesModel,
  GridRowParams,
  MuiEvent,
} from "@mui/x-data-grid/models";
import { useEffect, useState } from "react";
import { ISetProductStateAction } from "../ProductEditorWrapper";

interface IProductVariantPriceEditorProps {
  disabled: boolean;
  state: ISetProductStateData;
  dispatch: React.Dispatch<ISetProductStateAction>;
  pricelistsData: IPriceList[];
}

interface IProductVariantPriceTable extends IProductVariant {
  id: string;
}

const ProductVariantPricesEditor = ({
  disabled,
  state,
  dispatch,
  pricelistsData,
}: IProductVariantPriceEditorProps) => {
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);

  const [rows, setRows] = useState<IProductVariantPriceTable[]>([]);

  const [updateMainState, setUpdateMainState] = useState<boolean>(false);

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  useEffect(() => {
    console.log("updateMainState-UpdatingPriceRows", updateMainState);
    if (state.product_variants) {
      setRows(
        state.product_variants.map((productVariant: IProductVariant) => ({
          id: productVariant.sku,
          sku: productVariant.sku,
          ...deserializeProductVariantPricesToRow(
            productVariant,
            pricelistsData
          ),
        }))
      );
    }
  }, [state.product_variants]);

  useEffect(() => {
    // when the rows change, we need to serialize the attributes and prices and then dispatch the action
    // to set the product_variants in the state
    if (!updateMainState) {
      return;
    }
    console.log("updateMainState-Price", updateMainState);

    setUpdateMainState(false);
    if (!rows || rows?.length == 0) {
      dispatch({
        type: ActionSetProduct.SETPRODUCTVARIANTS,
        payload: { product_variants: [] },
      });
      return;
    }
    console.log("settingrows", rows);

    const variantsToSet = rows.map(
      (row) =>
        ({
          ...(row as IProductVariant),
          price: serializeProductVariantPricesFromRow(row, pricelistsData),
        } as IProductVariant)
    );
    console.log("settingrows2", rows, variantsToSet);

    dispatch({
      type: ActionSetProduct.SETPRODUCTVARIANTS,
      payload: {
        product_variants: variantsToSet,
      },
    });
  }, [updateMainState]);

  const columns: GridColDef[] = [
    {
      field: "sku",
      headerName: "SKU",
      editable: false,
      width: 125,
      minWidth: 150,
      maxWidth: 200,
      sortable: false,
      disableColumnMenu: true,
    },
    ...(pricelistsData
      ? pricelistsData?.map((pricelist: IPriceList) => ({
          field: `$PRICE_${pricelist.code}`,
          headerName: pricelist.code,
          editable: true,
          width: 125,
          minWidth: 150,
          maxWidth: 200,
          sortable: false,
          disableColumnMenu: true,
        }))
      : []), // <-- this generates pricelist columns
  ];

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

  const processRowUpdate = (
    newRow: IProductVariantPriceTable,
    oldRow: IProductVariantPriceTable
  ) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    setUpdateMainState(true);
    return updatedRow;
  };

  return (
    <EditorCard>
      <CollapsableContentWithTitle title="Prices">
        {disabled ? (
          <Typography variant="body1" color="textSecondary">
            Adding or editing product variant prices will be available after
            first save.
          </Typography>
        ) : (
          <>
            <Typography variant="body1" color="textSecondary">
              Matrix of prices for each product variant. You can edit the prices
              directly in the table.
            </Typography>
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
              slotProps={{
                toolbar: { setRows, setRowModesModel },
              }}
              sx={{ overflowX: "scroll" }}
            />
          </>
        )}
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};

export default ProductVariantPricesEditor;
