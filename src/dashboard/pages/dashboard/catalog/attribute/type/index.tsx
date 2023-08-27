// /dashboard/catalog/products-types

// next.js
import { useRouter } from "next/router";

// libraries
import useSWR from "swr";

// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { ReactElement, useEffect, useState } from "react";
import RootLayout from "@/pages/layout";
// components
// mui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
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
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
// types
import { IAttributeType, IAttributeTypePostRequest } from "@/types/product";
// api
import { postAttributeType } from "@/api/product/attributes";
import { useSnackbarState } from "@/utils/snackbar";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { productAttributeTypeAPI } from "@/pages/api/product/attribute/type";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: IAttributeType) => IAttributeType
  ) => void;
}

const EditToolbar = (props: EditToolbarProps) => {
  const { setRows, setRowModesModel } = props;
  const router = useRouter();

  const handleClick = async () => {
    // post new row with empty name and obtain ID and set it
    const newRow = {
      type_name: "",
      base_attributes: [],
    };
    postAttributeType({
      type_name: newRow.type_name,
      base_attributes: [],
    } as IAttributeTypePostRequest)
      .then((res) => {
        console.log("res", res);
        setRows((oldRows) => [
          ...oldRows,
          {
            ...newRow,
            id: res.id,
          },
        ]);
        setRowModesModel((oldModel) => ({
          ...oldModel,
          [res.id]: GridRowModes.Edit,
        }));
        router.push(`/dashboard/catalog/attribute/type/${res.id}`);
      })
      .catch((err) => {
        console.log(err);
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

const DashboardAttributeTypePage = ({
  productAttributeTypeData,
}: {
  productAttributeTypeData: IAttributeType[];
}) => {
  const [rows, setRows] = useState<IAttributeType[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const [snackbar, setSnackbar] = useSnackbarState();

  const router = useRouter();

  console.log("rows", rows);

  useEffect(() => {
    if (productAttributeTypeData) {
      setRows(
        productAttributeTypeData.map((type: IAttributeType) => ({
          ...type,
        }))
      );
    }
  }, [productAttributeTypeData]);

  const columns: GridColDef[] = [
    {
      field: "type_name",
      headerName: "Name",
      editable: false,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "unit",
      headerName: "Unit",
      editable: false,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "base_attributes",
      headerName: "N. of attributes",
      editable: false,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (params) => {
        return params.row?.base_attributes?.length || 0;
      },
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
              router.push(`/dashboard/catalog/attribute/type/${id}`);
            }}
            color="inherit"
            key={"edit"}
          />,
        ];
      },
    },
  ];
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
            Attributes
          </Typography>
        </Stack>
        <Card elevation={0}>
          <DataGrid
            rows={rows}
            columns={columns}
            density={"compact"}
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
      </Container>
    </DashboardLayout>
  );
};

DashboardAttributeTypePage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  const productAttributeTypeData = await productAttributeTypeAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: { productAttributeTypeData },
  };
};

export default DashboardAttributeTypePage;
