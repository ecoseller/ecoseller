import DashboardLayout from "@/pages/dashboard/layout";
import React, { ReactElement } from "react";
import RootLayout from "@/pages/layout";
import Container from "@mui/material/Container";
import { NextApiRequest, NextApiResponse } from "next";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import { reviewListAPI } from "@/pages/api/review";
import { IReview } from "@/types/review";
import { ReviewList } from "@/components/Dashboard/Review/ReviewList";

interface IDashboardReviewPageProps {
    reviews: IReview[];
}

const OrderListPage = ({ reviews }: IDashboardReviewPageProps) => {

    console.log(reviews);
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
                        Review list
                    </Typography>
                </Stack>
                <Card elevation={0}>
                    <ReviewList reviews={reviews} />
                </Card>
            </Container>
        </DashboardLayout>
    );
};

OrderListPage.getLayout = (page: ReactElement) => {
    return (
        <RootLayout>
            <DashboardLayout>{page}</DashboardLayout>
        </RootLayout>
    );
};

export const getServerSideProps = async (context: any) => {
    const { req, res } = context;
    const reviews: IReview[] = await reviewListAPI(
        "GET",
        req as NextApiRequest,
        res as NextApiResponse
    );

    console.log("REVIEWS", reviews)

    return { props: { reviews: reviews } };
};

export default OrderListPage;
