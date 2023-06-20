// /dashboard/product/add

// next.js
// react
import { ReactElement, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
import ProductEditorWrapper from "@/components/Dashboard/Catalog/Products/Editor/ProductEditorWrapper";
// mui
import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import { IAttributeType, IProduct } from "@/types/product";
import { axiosPrivate } from "@/utils/axiosPrivate";
import { IPriceList } from "@/types/localization";
import { PermissionProvider } from "@/utils/context/permission";
import { pricelistListAPI } from "@/pages/api/product/price-list";
import { productDetailAPI } from "@/pages/api/product/[id]";
import { NextApiRequest, NextApiResponse } from "next";
import { reviewDetailAPI } from "@/pages/api/review/detail/[id]";
import { reviewRatingAPI } from "@/pages/api/review/rating/[id]";
import { IReview } from "@/types/review";
import { Typography } from "@mui/material";

interface IProps {
    review: IReview,
    productAverageRating: number
}

const DashboardProductsEditPage = ({ review, productAverageRating }: IProps) => {
    const router = useRouter();
    console.log("AVERAGE RATING", productAverageRating)

    return (
        <DashboardLayout>
            <Container maxWidth="xl">
                <Typography variant="h4" gutterBottom>
                    Review #{review.product_variant}
                </Typography>
            </Container>
        </DashboardLayout>
    );
};

DashboardProductsEditPage.getLayout = (page: ReactElement) => {
    return (
        <RootLayout>
            <DashboardLayout>{page}</DashboardLayout>
        </RootLayout>
    );
};

export const getServerSideProps = async (context: any) => {
    /**
     * Initial data for product editor
     * - attributes
     * - pricelists
     * - product (if id is provided)
     *
     * If id is not provided or product is not found, return 404
     */

    const { req, res } = context;
    const { id } = context.query;
    // feth product data
    const review = await reviewDetailAPI(
        id,
        "GET",
        req as NextApiRequest,
        res as NextApiResponse
    );

    const productAverageRating = await reviewRatingAPI(
        review.product,
        "GET",
        req as NextApiRequest,
        res as NextApiResponse
    );

    return {
        props: {
            review,
            productAverageRating,
        },
    };
};

export default DashboardProductsEditPage;
