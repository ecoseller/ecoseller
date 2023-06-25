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
import { IReview } from "@/types/review";
import { Box, Grid, Rating, Stack, TextField, Typography } from "@mui/material";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import StarIcon from "@mui/icons-material/Star";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { productRatingAPI } from "@/pages/api/review/distribution/[id]";
import { AverageRating } from "@/components/Dashboard/Review/AverageRating";

interface IProps {
  review: IReview;
  productRating: any;
}

const labels: { [index: string]: string } = {
  10: "Useless",
  20: "Useless+",
  30: "Poor",
  40: "Poor+",
  50: "Ok",
  60: "Ok+",
  70: "Good",
  80: "Good+",
  90: "Excellent",
  100: "Excellent+",
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const DashboardProductsEditPage = ({ review, productRating }: IProps) => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <TopLineWithReturn
          title={`Review #${review.product_variant}`}
          returnPath={"/dashboard/reviews"}
        />
        <Grid container spacing={2}>
          <Grid item md={8} xs={12}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <Typography variant="h5" gutterBottom>
                  Rating:
                </Typography>
                <Rating
                  name="hover-feedback"
                  value={review.rating / 20}
                  readOnly={true}
                  precision={0.1}
                  getLabelText={getLabelText}
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                  icon={<StarIcon fontSize="inherit" color="primary" />}
                />
                {review.rating !== null && (
                  <Typography variant="h6">
                    {labels[review.rating] + " (" + review.rating + "%" + ")"}
                  </Typography>
                )}
              </Stack>
              <Stack direction="row" spacing={2}>
                <Typography variant="h5" gutterBottom>
                  Product ID:
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {review.product}
                </Typography>
              </Stack>
              <Stack direction="column" spacing={2}>
                <Typography variant="h5" gutterBottom>
                  Comment:
                </Typography>
                <TextField
                  label="Review comment"
                  multiline
                  rows={15}
                  variant="outlined"
                  fullWidth
                  value={review.comment}
                />
              </Stack>
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <AverageRating productRating={productRating} />
          </Grid>
        </Grid>
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

  const productRating = await productRatingAPI(
    review.product,
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      review,
      productRating,
    },
  };
};

export default DashboardProductsEditPage;
