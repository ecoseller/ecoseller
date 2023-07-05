// next
import { useRouter } from "next/router";
import getConfig from "next/config";

// react

// libs
import { productAPI } from "@/pages/api/product/[id]";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// components
import MediaGallery from "@/components/ProductDetail/MediaGallery";
import ProductVariants from "@/components/ProductDetail/ProductVariants/Table";
import HeadMeta from "@/components/Common/SEO";
import ProductsSlider from "@/components/Common/ProductsSlider";

// mui
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";

// types
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
} from "next/types";
import { orderItemsAPI } from "../api/order/items/[id]";
import { Alert, Container, Snackbar } from "@mui/material";
import { useState } from "react";
import CollapsableContentWithTitle from "@/components/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Generic/EditorCard";
import ReviewForm from "@/components/Review/ReviewForm";
import { IItem } from "@/types/review";
import { useSnackbarState } from "@/utils/snackbar";

const { serverRuntimeConfig } = getConfig();

interface IReviewPageProps {
  items: IItem[];
  order_id: string;
}

const ReviewPage = ({ items, order_id }: IReviewPageProps) => {
  const { basePath } = useRouter();
  const [itemsState, setItemsState] = useState(items);

  const [snackbar, setSnackbar] = useSnackbarState();

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar(null);
  };

  const showSnackbar = (
    res: Response,
    messageSuccess: string,
    messageError: string
  ) => {
    console.log("showSnackbar", res);
    if (res?.ok) {
      console.log("success snackbar", res);
      setSnackbar({
        open: true,
        message: messageSuccess,
        severity: "success",
      });
    } else {
      console.log("error snackbar", res);
      setSnackbar({
        open: true,
        message: messageError,
        severity: "error",
      });
    }
  };

  return (
    <Container maxWidth="xl">
      {itemsState.map((item) => {
        return (
          <Box sx={{ mb: 2 }} key={item.product_id}>
            <EditorCard>
              <Grid item xs={12} md={4}>
                <ReviewForm
                  item={item}
                  order_id={order_id}
                  showSnackbar={showSnackbar}
                />
              </Grid>
            </EditorCard>
          </Box>
        );
      })}
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
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.query;
  const { res, req, locale } = context;

  const data = await orderItemsAPI(
    "GET",
    token as string,
    req as NextApiRequest,
    res as NextApiResponse
  );

  console.log(data);
  let items = [];
  if (data) {
    for (let i = 0; i < data.items.length; i++) {
      items.push({
        product_variant_name: data.items[i].product_variant_name as string,
        product_id: data.items[i].product_id as number,
        product_variant_sku: data.items[i].product_variant_sku as string,
      });
    }
  }

  return {
    props: {
      items: items,
      order_id: token,
      ...(await serverSideTranslations(locale as string, [
        "review",
        ...serverRuntimeConfig.commoni18NameSpaces,
      ])),
    },
  };
};

export default ReviewPage;
