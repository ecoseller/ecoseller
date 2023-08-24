// next.js
import { useRouter } from "next/router";

// libraries
import useSWR from "swr";

// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { ReactElement, useState } from "react";
import RootLayout from "@/pages/layout";
// components
// mui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbarContainer,
  GridRowModesModel,
  GridActionsCellItem,
  GridEventListener,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
// types
// api
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { paymentMethodListAPI } from "@/pages/api/cart/payment-method";
import { IPaymentMethod } from "@/types/cart/methods";
import imgPath from "@/utils/imgPath";
import { useSnackbarState } from "@/utils/snackbar";
import DeleteDialog from "@/components/Dashboard/Generic/DeleteDialog";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: IPaymentMethod) => IPaymentMethod
  ) => void;
}

const EditToolbar = (props: EditToolbarProps) => {
  const { setRows, setRowModesModel } = props;
  const router = useRouter();

  const handleClick = () => {
    // post new row with empty name and obtain ID and set it
    const newRow = {};
    fetch("/api/cart/payment-method", {
      method: "POST",
      body: JSON.stringify(newRow),
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          router.push(`/dashboard/cart/payment-method/${data.id}`);
        });
      }
    });
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add new
      </Button>
    </GridToolbarContainer>
  );
};

interface IDashboardPaymentMethodPageProps {
  paymentMethodsData: IPaymentMethod[];
}

const DashboardPaymentMethodPage = ({
  paymentMethodsData,
}: IDashboardPaymentMethodPageProps) => {
  const [rows, setRows] = useState<IPaymentMethod[]>(paymentMethodsData || []);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  console.log("paymentMethodsData", paymentMethodsData);
  const [snackbar, setSnackbar] = useSnackbarState();
  const [openDeleteDialog, setOpenDeleteDialog] = useState<number | undefined>(
    undefined
  );

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar(null);
  };

  const router = useRouter();

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      editable: false,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "image",
      headerName: "Image",
      editable: false,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <div
          style={{
            paddingTop: "5px",
            paddingBottom: "5px",
            height: "auto",
            width: "100%",
            flexShrink: 0,
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={imgPath(params.row.image)}
            style={{
              objectFit: "contain",
              position: "relative",
              height: "auto",
              maxHeight: "40px",
              width: "100%",
            }}
          />
        </div>
      ),
    },
    {
      field: "create_at",
      headerName: "Created",
      editable: false,
      flex: 1,
    },
    {
      field: "update_at",
      headerName: "Last update",
      editable: false,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      flex: 1,
      disableColumnMenu: true,
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => {
              router.push(`/dashboard/cart/payment-method/${id}`);
            }}
            color="inherit"
            key={"edit"}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => {
              setOpenDeleteDialog(id as number);
            }}
            color="inherit"
            key={"delete"}
          />,
        ];
      },
    },
  ];

  const handleDelete = (id: number) => {
    fetch(`/api/cart/payment-method/${id}`, {
      method: "DELETE",
    }).then((res) => {
      console.log("res", res);
      if (res.ok) {
        setSnackbar({
          open: true,
          message: "Payment method deleted",
          severity: "success",
        });
        setRows((oldRows) => {
          const newRows = oldRows.filter((row) => row.id !== id);
          return newRows;
        });
      }
    });
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Payment methods
          </Typography>
        </Stack>
        <Card elevation={0}>
          <DataGrid
            rows={rows}
            columns={columns}
            editMode={"row"}
            hideFooter={true}
            autoHeight={true}
            rowModesModel={rowModesModel}
            onRowEditStop={handleRowEditStop}
            slots={{
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
          />
        </Card>
        <DeleteDialog
          open={openDeleteDialog !== undefined}
          setOpen={() => setOpenDeleteDialog(undefined)}
          onDelete={async () => {
            if (openDeleteDialog === undefined) return;
            handleDelete(openDeleteDialog);
          }}
          text="this payment method"
        />
      </Container>
    </DashboardLayout>
  );
};

DashboardPaymentMethodPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const paymentMethodsData = await paymentMethodListAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      paymentMethodsData,
    },
  };
};

export default DashboardPaymentMethodPage;
