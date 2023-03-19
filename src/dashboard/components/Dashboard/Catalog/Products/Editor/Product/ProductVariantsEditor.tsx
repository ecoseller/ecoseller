/**
 * Complex table editor for product variants with inline editing and adding new rows.
 *
 */

// next.js
// react
// libs
import useSWR from "swr";
// layout
// components
import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
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
import { useRouter } from "next/router";
import { Alert, Snackbar } from "@mui/material";
// types
import {
  ActionSetProduct,
  IAttributeType,
  IBaseAttributes,
  IProductPrice,
  IProductVariant,
  ISetProductStateData,
} from "@/types/product";
import { ISetProductStateAction } from "../ProductEditorWrapper";
import { Attribution } from "@mui/icons-material";
import { IPriceList } from "@/types/localization";

interface IProductVariantTable extends IProductVariant {
  id: string;
  isNew: boolean;
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: IProductVariantTable) => IProductVariantTable
  ) => void;
}

const EditToolbar = (props: EditToolbarProps) => {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, sku: "", ean: "", weight: 0, attributes: [], isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add variant
      </Button>
    </GridToolbarContainer>
  );
};
interface IProductVariantsEditorProps {
  disabled: boolean;
  state: ISetProductStateData;
  dispatch: React.Dispatch<ISetProductStateAction>;
  attributesData: IAttributeType[];
  pricelistsData: IPriceList[];
}

const ProductVariantsEditor = ({
  disabled,
  state,
  dispatch,
  attributesData,
  pricelistsData,
}: IProductVariantsEditorProps) => {
  const router = useRouter();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);

  const [rows, setRows] = useState<IProductVariantTable[]>([]);

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const serializeAttributes = (row: any) => {
    // since attributes in the row are stored as $ATTRIBUTE_... we need to filter them out and serialize them
    // into an array of numbers (attribute ids) that the backend expects
    if (!row) return [];
    const attributes = Object.entries(row)
      .filter(([key, value]) => key.startsWith("$ATTRIBUTE_") && value)
      .map(([key, value]) => value);

    return attributes;
  };

  const deserializeAttributes = (row: any) => {
    // since attributes are initialy stored as an array of numbers (attribute ids) we need to firstly
    // create an object with keys $ATTRIBUTE_... and then assign value to them (item from the array that is also in the base_attributes array (as id))
    if (!row?.attributes) return {};
    let attributes: any = {};
    attributesData?.forEach((attribute: IAttributeType) => {
      attributes[`$ATTRIBUTE_${attribute.type_name}`] =
        attribute.base_attributes
          .map((baseAttribute: IBaseAttributes) => baseAttribute.id)
          ?.find(
            (id: number) =>
              id ===
              row.attributes.find((attributeId: number) => attributeId === id)
          );
    });
    return attributes;
  };

  const serializePrices = (row: any) => {
    // since prices in the row are stored as $PRICE_... we need to filter them out and serialize them
    // into an array of objects that the backend expects, where expected format is { pricelist: number, price: number }
    if (!row) return [];
    const prices = Object.entries(row)
      .filter(([key, value]) => key.startsWith("$PRICE_") && value)
      .map(([key, value]) => ({
        price_list: pricelistsData?.find(
          (pricelist) => pricelist.code === key.replace("$PRICE_", "")
        )?.code,
        price: Number(value),
      }));

    return prices;
  };

  const deserializePrices = (row: any) => {
    // since prices are initialy stored as an array of objects that the backend expects, where expected format is { pricelist: number, price: number }
    if (!row?.price) return {};
    let prices: any = {};
    pricelistsData?.forEach((pricelist: IPriceList) => {
      prices[`$PRICE_${pricelist.code}`] = row.price.find(
        (price: any) => price.price_list === pricelist.code
      )?.price;
    });

    return prices;
  };

  useEffect(() => {
    // when the component is mounted, we need to set the rows to the product_variants from the state
    // and also deserialize the attributes and prices
    // we also need to set the id of the row to the sku, because sku is the primary key of the variant
    // and we need to set isNew to false, because we are not creating a new variant, but editing an existing one

    if (rows?.length > 0) {
      return;
    }
    setRows(
      state?.product_variants
        ? state?.product_variants.map((variant: IProductVariant) => ({
            ...variant,
            ...deserializeAttributes(variant),
            ...deserializePrices(variant),
            id: variant.sku,
            isNew: false,
          }))
        : []
    );
  }, [state.product_variants?.length]);

  // const setRowsAndDispatch

  useEffect(() => {
    // when the rows change, we need to serialize the attributes and prices and then dispatch the action
    // to set the product_variants in the state
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
          attributes: serializeAttributes(row),
          price: serializePrices(row),
        } as IProductVariant)
    );
    console.log("settingrows2", rows, variantsToSet);

    dispatch({
      type: ActionSetProduct.SETPRODUCTVARIANTS,
      payload: {
        product_variants: variantsToSet,
      },
    });
  }, [rows?.length]);

  const columns: GridColDef[] = [
    {
      field: "sku",
      headerName: "SKU",
      description:
        "If you provide SKU that already exists, it will be updated instead of creating a new one.",
      editable: true,
      width: 125,
      minWidth: 150,
      maxWidth: 200,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "ean",
      headerName: "EAN",
      editable: true,
      width: 125,
      minWidth: 150,
      maxWidth: 200,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "weight",
      headerName: "Weight",
      editable: true,
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
    ...(attributesData
      ? attributesData?.map((attribute) => ({
          field: `$ATTRIBUTE_${attribute.type_name}`,
          headerName: attribute.type_name,
          editable: true,
          width: 125,
          minWidth: 150,
          maxWidth: 200,
          sortable: false,
          disableColumnMenu: true,
          type: "singleSelect",
          valueOptions: [
            {
              value: null,
              label: "",
            },
            ...attribute.base_attributes.map((value: IBaseAttributes) => ({
              value: value.id,
              label:
                value.value + `${attribute.unit ? " " + attribute.unit : ""}`,
            })),
          ],
        }))
      : []), // <-- this generates attributes columns

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
  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "Prices",
      children: [
        ...(pricelistsData?.map((pricelist: IPriceList) => ({
          field: `$PRICE_${pricelist.code}`,
        })) || []), // <-- this creates groupping for pricelists
      ],
    },
    {
      groupId: "Attributes",
      children: [
        ...(attributesData?.map((attribute) => ({
          field: `$ATTRIBUTE_${attribute.type_name}`,
        })) || []), // <-- this creates groupping for attributes
      ],
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
    const row = rows.find((row) => row.id === id);
    if (!row) return;
    // open variant editor page with SKU
    if (!row.sku) {
      setSnackbar({
        open: true,
        message: "SKU is required",
        severity: "error",
      });
      return;
    }
    router.push(`/products/variants/${row.sku}`);
    // setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
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

  const processRowUpdate = (
    newRow: IProductVariantTable,
    oldRow: IProductVariantTable
  ) => {
    const updatedRow = { ...newRow, isNew: false };

    // check if row has SKU
    // if not, show error
    // if yes, save row
    if (!updatedRow.sku) {
      setSnackbar({
        open: true,
        message: "SKU is required",
        severity: "error",
      });
      throw new Error("SKU is required");
    }

    // check if SKU has changed
    // if yes, check if SKU already exists
    // if yes, load existing variant and show warning
    // if no, save row
    if (updatedRow.sku !== oldRow.sku) {
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
    <EditorCard>
      <CollapsableContentWithTitle title="Variants">
        {disabled ? (
          <Typography variant="body1" color="textSecondary">
            Adding or editing product variants will be available after first
            save.
          </Typography>
        ) : (
          // <div style={{ height: 250, width: "100%" }}>
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
            experimentalFeatures={{ columnGrouping: true }}
            columnGroupingModel={columnGroupingModel}
            sx={{ overflowX: "scroll" }}
          />
          // </div>
        )}
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

export default ProductVariantsEditor;
