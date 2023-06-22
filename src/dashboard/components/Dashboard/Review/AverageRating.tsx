import { IOrder } from "@/types/order";
import { DataGrid, GridActionsCellItem, GridColDef, GridDeleteIcon } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { IReview } from "@/types/review";
import { Visibility } from "@mui/icons-material";
import { Alert, Box, Card, Grid, LinearProgress, Rating, Snackbar, Stack, Typography } from "@mui/material";
import { reviewListAPI } from "@/pages/api/review";
import StarIcon from '@mui/icons-material/Star';

interface IAverageRatingProps {
    productRating: any;
}

export const AverageRating = ({ productRating }: IAverageRatingProps) => {
    const total_reviews = productRating.total_reviews;
    const average_rating = productRating.average_rating;
    let distrMap: Map<string, number> = new Map<string, number>(Object.entries(productRating));


    const scaling = 100 / total_reviews;

    return (
        <Stack spacing={2}>
            <Typography variant="h4" gutterBottom>
                Average product rating
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Stack direction="column" spacing={2} sx={{ ml: 8 }}>
                    <Typography variant="h3" gutterBottom sx={{ ml: 6 }}>
                        {Math.round((average_rating / 20) * 10) / 10}
                    </Typography>
                    <Rating
                        name="hover-feedback"
                        size="large"
                        value={Math.round((average_rating / 20) * 10) / 10}
                        readOnly={true}
                        precision={0.1}
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                        icon={<StarIcon fontSize="inherit" color="primary" />}
                    />
                    <Grid item xs sx={{ mt: 1.5 }}>
                        <Typography gutterBottom sx={{ ml: 5 }}>
                            {total_reviews} reviews
                        </Typography>
                    </Grid>
                </Stack>
            </Box>
            {
                Array.from(distrMap).slice(0, 5).reverse().map((item, index) => (
                    <Stack direction="row" key={index}>
                        <Typography variant="h5" gutterBottom sx={{ mt: 0.5 }}>
                            {item[0]}
                        </Typography>
                        <StarIcon fontSize="large" color="primary" />
                        <Grid item xs sx={{ mt: 1.5 }}>
                            <LinearProgress sx={{ height: 10, borderRadius: 5 }} variant="determinate" value={item[1] * scaling} />
                        </Grid>
                        <Typography gutterBottom sx={{ mt: 0.5, ml: 1 }}>
                            {item[1]}x
                        </Typography>
                    </Stack>
                ))
            }
        </Stack>
    );
};
