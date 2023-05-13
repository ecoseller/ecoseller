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
  useGridApiContext,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { randomId } from "@mui/x-data-grid-generator";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
// types
import {
  IPaymentMethodCountryFullList,
  IShippingMethod,
  IShippingMethodCountry,
} from "@/types/cart/methods";
import { ICountry, IVatGroup } from "@/types/country";
import { ICurrency } from "@/types/localization";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";

interface IShippingMethodCountryTable extends IShippingMethodCountry {
  isNew: boolean;
  valid: boolean;
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (
      oldModel: IShippingMethodCountryTable
    ) => IShippingMethodCountryTable
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

interface IShippingMethodCountryEditorProps {
  countries: ICountry[];
  vatGroups: IVatGroup[];
  shippingMethod: IShippingMethod;
  shippingMethodCountries: IShippingMethodCountry[];
  currencies: ICurrency[];
  paymentMethodCountryFullList: IPaymentMethodCountryFullList[];
}

const ShippingMethodCountryEditor = ({
  countries,
  vatGroups,
  shippingMethod,
  shippingMethodCountries,
  currencies,
  paymentMethodCountryFullList,
}: IShippingMethodCountryEditorProps) => {
  console.log("shippingMethodCountries", shippingMethodCountries);
  console.log("paymentMethodCountryFullList", paymentMethodCountryFullList);
  const [rows, setRows] = useState<IShippingMethodCountryTable[]>(
    shippingMethodCountries.map((smc) => ({
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

  const validateRow = (row: IShippingMethodCountryTable) => {
    if (row.price === undefined || row.price === null) {
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
    newRow: IShippingMethodCountryTable,
    oldRow: IShippingMethodCountryTable
  ) => {
    if (!validateRow(newRow)) {
      throw new Error("Invalid row");
    }

    const updatedRow = { ...newRow, isNew: false };
    console.log("updatedRow", updatedRow);

    // if row is new, save it to the database
    if (newRow.isNew) {
      console.log("newRow", newRow);
      fetch(`/api/cart/shipping-method/${shippingMethod.id}/country`, {
        method: "POST",
        body: JSON.stringify({
          shipping_method: shippingMethod.id,
          country: newRow.country,
          vat_group: newRow.vat_group,
          currency: newRow.currency,
          price: newRow.price,
          is_active: newRow.is_active,
          payment_methods: newRow.payment_methods,
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
      `/api/cart/shipping-method/${shippingMethod.id}/country/${newRow.id}/`,
      {
        method: "PUT",
        body: JSON.stringify({
          shipping_method: shippingMethod.id,
          country: newRow.country,
          vat_group: newRow.vat_group,
          currency: newRow.currency,
          price: newRow.price,
          is_active: newRow.is_active,
          payment_methods: newRow.payment_methods,
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
    fetch(`/api/cart/shipping-method/${shippingMethod.id}/country/${id}`, {
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

  const CustomPaymentMethodComponent = (props: any) => {
    const { id, value, field } = props;
    const country = props?.row?.country;

    const apiRef = useGridApiContext();
    console.log("country", country);
    const handleChange = (event: any) => {
      const eventValue = event.target.value; // The new value entered by the user
      console.log({ eventValue });
      const newValue =
        typeof eventValue === "string" ? value.split(",") : eventValue;
      apiRef.current.setEditCellValue({
        id,
        field,
        value: newValue.filter((x: any) => x !== ""),
      });
    };

    if (!country)
      return (
        <Typography variant="body2" color="error">
          Please select country first
        </Typography>
      );

    return (
      <Select
        labelId="payment-method-select-label"
        id="payment-method-select"
        multiple
        value={value || []}
        onChange={handleChange}
        sx={{ width: "100%" }}
      >
        {paymentMethodCountryFullList
          ?.filter(
            (option: IPaymentMethodCountryFullList) => option.country == country
          )
          .map((option: IPaymentMethodCountryFullList) => (
            <MenuItem key={option.id} value={option.id}>
              {option.payment_method.title} {option.country}
            </MenuItem>
          ))}
      </Select>
    );
  };

  const CustomPaymentMethodEditCell = (params: any) => (
    <CustomPaymentMethodComponent {...params} />
  );

  const CustomFilterInputSingleSelect = (props: any) => {
    const { item, applyValue, type, apiRef, focusElementRef, ...others } =
      props;

    const country = props?.row?.country;

    return (
      <TextField
        id={`contains-input-${item.id}`}
        value={item.value}
        onChange={(event) => applyValue({ ...item, value: event.target.value })}
        type={type || "text"}
        variant="standard"
        InputLabelProps={{
          shrink: true,
        }}
        inputRef={focusElementRef}
        select
        SelectProps={{
          native: true,
        }}
      >
        {paymentMethodCountryFullList.map(
          (option: IPaymentMethodCountryFullList) => (
            <option key={option.id} value={option.id}>
              {option?.payment_method.title}
            </option>
          )
        )}
      </TextField>
    );
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
      // this should be a select field with payment methods
      // taken from:
      // https://github.com/mui/mui-x/issues/4410#issuecomment-1095104938
      // https://codesandbox.io/s/columntypesgrid-material-demo-forked-4bbcrv?file=/demo.js:2859-2965
      field: "payment_methods",
      headerName: "Payment Methods",
      type: "singleSelect",
      editable: true,
      width: 125,
      minWidth: 150,
      maxWidth: 200,
      valueFormatter: ({ value }) =>
        value
          ? // map over values and get payment method title
            value?.map((paymentMethodId: number) => {
              const paymentMethod = paymentMethodCountryFullList?.find(
                (paymentMethodCountry: IPaymentMethodCountryFullList) =>
                  paymentMethodCountry.id === paymentMethodId
              );
              return paymentMethod?.payment_method.title;
            })
          : "",
      renderEditCell: CustomPaymentMethodEditCell,
      valueOptions: (params) => {
        // get payment methods for country
        const country = params.row.country;
        const paymentMethods = paymentMethodCountryFullList?.filter(
          (paymentMethodCountry: IPaymentMethodCountryFullList) =>
            paymentMethodCountry.country === country
        );
        return paymentMethods?.map(
          (paymentMethod: IPaymentMethodCountryFullList) => ({
            value: paymentMethod.id,
            label: paymentMethod.payment_method.title,
          })
        );
      },
      filterOperators: [
        {
          value: "contains",
          getApplyFilterFn: (filterItem) => {
            if (filterItem.value == null || filterItem.value === "") {
              return null;
            }
            return ({ value }) => {
              // if one of the cell values corresponds to the filter item
              return value.some(
                (cellValue: number) => cellValue === filterItem.value
              );
            };
          },
          InputComponent: CustomFilterInputSingleSelect,
        },
      ],
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

export default ShippingMethodCountryEditor;
