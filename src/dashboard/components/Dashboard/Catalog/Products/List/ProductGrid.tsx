// /components/dashboard/catalog/products/list/ProductGrid.tsx
// next.js
import Image from "next/image";
import { useRouter } from "next/router";
// react
import { useState } from "react";
// libraries
import useSWR from "swr";
// layout
// components
// mui
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRenderCellParams,
} from "@mui/x-data-grid";
// types
import { IProductList } from "@/types/product";
import imgPath from "@/utils/imgPath";

const PAGE_SIZE = 30;

const useProducts = (page: number, pageSize: number) => {
  const { data, error, mutate } = useSWR<IProductList | undefined>(
    `/product/dashboard/?page=${page + 1}&limit=${pageSize}`
  );

  return {
    products: data?.results || [],
    isLoading: !error && !data,
    isError: error,
    count: data?.count,
    totalPages: data?.total_pages,
  };
};

const ProductGrid = () => {
  const router = useRouter();
  const [paginationModel, setPaginationModel] = useState<{
    page: number;
    pageSize: number;
  }>({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  const { products, isLoading, isError, count, totalPages } = useProducts(
    paginationModel?.page,
    paginationModel?.pageSize
  );

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "#",
      editable: false,
      maxWidth: 100,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "title",
      headerName: "Title",
      editable: false,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "primary_image",
      headerName: "Photo",
      editable: false,
      // maxWidth: 150,
      flex: 1,
      type: "image",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <div
          style={{
            paddingTop: "5px",
            paddingBottom: "5px",
            width: "200px",
            height: "100%",
            flexShrink: 0,
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={imgPath(params.row.primary_image?.media)}
            alt={params.row.primary_image?.alt}
            // quality={60}
            // width={100}
            // height={200}
            style={{
              objectFit: "contain",
              position: "relative",
              height: "85px",
              width: "auto",
            }}
          />
        </div>
      ),
    },
    {
      field: "published",
      headerName: "Published",
      editable: false,
      maxWidth: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) =>
        params?.row?.published ? (
          <CheckCircleRoundedIcon />
        ) : (
          <CancelRoundedIcon />
        ),
    },
    {
      field: "update_at",
      headerName: "Updated at",
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
              router.push(`/dashboard/catalog/products/edit/${id}`);
            }}
            color="inherit"
            key={"edit"}
          />,
        ];
      },
    },
  ];

  return (
    <DataGrid
      rows={products}
      columns={columns}
      pageSizeOptions={[PAGE_SIZE, 60, 90]}
      rowCount={count}
      paginationMode="server"
      onPaginationModelChange={setPaginationModel}
      paginationModel={paginationModel}
      loading={isLoading}
      autoHeight={true}
      disableRowSelectionOnClick
      getRowHeight={() => "auto"}
    />
  );
};

export default ProductGrid;
