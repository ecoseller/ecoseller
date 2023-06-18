import { IOrder } from "@/types/order";
import { DataGrid, GridActionsCellItem, GridColDef, GridDeleteIcon } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { IReview } from "@/types/review";
import { Visibility } from "@mui/icons-material";
import { Alert, Card, Snackbar } from "@mui/material";
import { reviewListAPI } from "@/pages/api/review";

interface IReviewListProps {
    reviews: IReview[];
}

export const ReviewList = ({ reviews }: IReviewListProps) => {
    const router = useRouter();
    const [reviewState, setReviewState] = useState<IReview[]>(reviews);

    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error" | "info" | "warning";
    } | null>(null);

    const handleSnackbarClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbar(null);
    };

    const fetchReviews = async () => {
        const reviews: IReview[] = await fetch("/api/review")
            .then((res) => res.json())
            .catch((err) => {
                console.log(err);
                return [];
            });
        setReviewState(reviews);
    };

    const columns: GridColDef[] = [
        {
            field: "token",
            headerName: "#",
            editable: false,
            flex: 1,
            renderCell: (params) => {
                return <span>{params.value}</span>;
            },
            minWidth: 300,
        },
        {
            field: "product_variant",
            headerName: "Product Variant",
            editable: false,
            flex: 1,
        },
        {
            field: "product",
            headerName: "Product ID",
            editable: false,
            flex: 1,
        },
        {
            field: "rating",
            headerName: "Rating",
            editable: false,
            flex: 1,
        },
        {
            field: "comment",
            headerName: "Comment",
            editable: false,
            flex: 1,
        },
        {
            field: "create_at",
            headerName: "Created at",
            editable: false,
            flex: 1,
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
                        icon={<Visibility />}
                        label="Detail"
                        className="textPrimary"
                        onClick={() => {
                            router.push(`/dashboard/reviews/${id}`);
                        }}
                        color="inherit"
                        key={"detail"}
                    />,
                    <GridActionsCellItem
                        icon={<GridDeleteIcon />}
                        label="Delete"
                        className="textPrimary"
                        onClick={async () => {
                            fetch(`/api/review/${id}`, {
                                method: "DELETE",
                            })
                                .then((res) => {
                                    setSnackbar({
                                        open: true,
                                        message: "Review deleted",
                                        severity: "success",
                                    });
                                    fetchReviews();
                                })
                                .catch((err) => {
                                    setSnackbar({
                                        open: true,
                                        message: "Error deleting review",
                                        severity: "error",
                                    });
                                });
                        }}
                        color="inherit"
                        key={"delete"}
                    />,
                ];
            },
        },
    ];

    return (
        <Card elevation={0}>
            <DataGrid
                rows={reviewState}
                columns={columns}
                hideFooter
                // pageSizeOptions={[PAGE_SIZE, 60, 90]}
                // initialState={{
                //   pagination: {
                //     paginationModel: {
                //       pageSize: PAGE_SIZE,
                //     },
                //   },
                // }}
                autoHeight={true}
                disableRowSelectionOnClick
                getRowId={(row) => row.token}
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
        </Card>
    );
};
