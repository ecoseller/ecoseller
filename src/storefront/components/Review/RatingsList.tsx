import { IOrder } from "@/types/order";
import { DataGrid, GridActionsCellItem, GridColDef, GridDeleteIcon } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { Opacity, Visibility } from "@mui/icons-material";
import { Alert, Box, Card, Divider, Grid, LinearProgress, Rating, Snackbar, Stack, TextField, Typography, alpha } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import { IReview, getLabelText } from "@/types/review";

interface IReviewsProps {
    reviews: IReview[];
}

export const ReviewsList = ({ reviews }: IReviewsProps) => {

    console.log(reviews);
    return (
        <Stack spacing={2}>
            {
                reviews.map((review, index) => (
                    <Stack direction="column">
                        <Grid item xs sx={{ mt: 1.5 }}>
                            <Divider sx={{ borderStyle: "dashed" }} />
                        </Grid>
                        <Typography variant="h6" gutterBottom sx={{ mt: 0.5 }}>
                            Review #{index + 1}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 0.5 }}>
                            Reviewed variant: {review.product_variant}
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 0.5 }} style={{ opacity: 0.55 }}>
                            Posted at {review.create_at}
                        </Typography>
                        <Stack direction="column" spacing={2}>
                            <Rating
                                name="hover-feedback"
                                value={review.rating / 20}
                                readOnly={true}
                                precision={0.1}
                                getLabelText={getLabelText}
                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                icon={<StarIcon fontSize="inherit" color="primary" />}
                            />
                            <TextField
                                label="Review comment"
                                multiline
                                rows={5}
                                variant="outlined"
                                fullWidth
                                value={review.comment}
                            />
                        </Stack>
                        <Grid item xs sx={{ mt: 1.5 }}>
                            <Divider sx={{ borderStyle: "dashed" }} />
                        </Grid>
                    </Stack>
                ))
            }
        </Stack>
    );
};