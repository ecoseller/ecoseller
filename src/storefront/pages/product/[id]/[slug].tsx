// next
import { useRouter } from "next/router";
import Link from "next/link";
import getConfig from "next/config";
// utils
import { useTranslation } from "next-i18next";
// react

// libs
import { productAPI } from "@/pages/api/product/[id]";
import EditorJsOutput from "@/utils/editorjs/EditorJsOutput";
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
  IProductDetail,
  IProductRecord,
  IProductSliderData,
} from "@/types/product";
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
} from "next/types";
import { countryDetailAPI } from "@/pages/api/country/[code]";
import { ICountry } from "@/types/country";
import BreadcrumbCategoryNav from "@/components/Common/BreadcrumbCategoryNav";
import { DEFAULT_COUNTRY } from "@/utils/defaults";
import { AverageRating } from "@/components/Review/AverageRating";
import { productRatingAPI } from "@/pages/api/review/rating/[token]";
import { productReviewListAPI } from "@/pages/api/review/list/[token]";
import { IReview } from "@/types/review";
import { ReviewsList } from "@/components/Review/RatingsList";
import { useRecommender } from "@/utils/context/recommender";
import { useEffect, useState } from "react";

const { serverRuntimeConfig } = getConfig();

interface IProductPageProps {
  data: IProductDetail;
  country: string;
  pricelist: string;
  productRating: any;
  productReviews: IReview[];
  countryDetail: ICountry;
}

const ProductPage = ({
  data,
  country,
  pricelist,
  productRating,
  productReviews,
  countryDetail,
}: IProductPageProps) => {
  const { basePath } = useRouter();
  const router = useRouter();
  const { t } = useTranslation("product");
  const { getRecommendations, sendEvent } = useRecommender();
  const [recommendedProducts, setRecommendedProducts] = useState<
    IProductRecord[]
  >([]);
  const [timeEntered] = useState<Date>(new Date());
  useEffect(() => {
    // load recommended products
    if (!country) return;

    getRecommendations("PRODUCT_DETAIL", {
      limit: 10,
      product_id: data.id,
      variants: data.product_variants?.map((v) => v.sku),
      country: countryDetail?.code,
      pricelist: countryDetail?.default_price_list,
    }).then((products: any[]) => {
      setRecommendedProducts(products);
    });
  }, [countryDetail]);

  useEffect(() => {
    const exitingFunction = () => {
      sendEvent(
        "PRODUCT_DETAIL_LEAVE",
        data.product_variants?.map((v) => {
          return {
            product_id: data.id,
            product_variant_sku: v.sku,
            time_spent: (new Date().getTime() - timeEntered.getTime()) / 1000,
          };
        })
      );
    };
    router.events.on("routeChangeStart", exitingFunction);

    return () => {
      console.log("unmounting component...");
      router.events.off("routeChangeStart", exitingFunction);
    };
  }, []);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <HeadMeta
        title={data.meta_title}
        description={data.meta_description}
        url={basePath}
      />
      <div className={`container`}>
        <BreadcrumbCategoryNav breadcrumbs={data.breadcrumbs} product={data} />
        <Grid
          container
          spacing={{ xs: 4, md: 4, lg: 4 }}
          columns={{ xs: 12, sm: 12, md: 12 }}
          pt={4}
        >
          <Grid container item xs={12} sm={12} md={5} direction="column">
            <MediaGallery media={data.media} />
          </Grid>
          <Grid container item xs={12} sm={12} md={7} direction="column">
            <Typography
              variant="h1"
              sx={{
                fontSize: "2rem",
              }}
              component={"h1"}
            >
              {data.title}
            </Typography>
            <>
              <Typography
                variant="h2"
                component={"h3"}
                sx={{ fontSize: "1.25rem", paddingTop: "20px" }}
              >
                {t("variants")}
              </Typography>
              <ProductVariants
                variants={data.product_variants}
                productId={data.id}
                country={country}
                pricelist={pricelist}
              />
            </>
          </Grid>
          <Box sx={{ pt: 5, pl: 3 }}>
            <EditorJsOutput data={data.description_editorjs} />
          </Box>
        </Grid>
        <Box sx={{ pt: 5 }}>
          <Typography variant="h4" gutterBottom>
            {t("recommended-products-title")}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {t("recommended-products-description")}
          </Typography>
          <ProductsSlider data={recommendedProducts || []} />
        </Box>
        <Box sx={{ pt: 5 }}>
          <Typography variant="h4" gutterBottom>
            {t("reviews")}
          </Typography>
          <AverageRating productRating={productRating} />
          <ReviewsList reviews={productReviews} />
        </Box>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, slug } = context.query;
  const { res, req, locale } = context;
  const language = Array.isArray(locale) ? locale[0] : locale || "en";
  let idNumber = Array.isArray(id) ? Number(id[0]) : Number(id) || null;

  if (!idNumber) {
    return {
      notFound: true,
    };
  }
  let { country } = req.cookies;

  const countryDetail: ICountry = await countryDetailAPI(
    "GET",
    country || DEFAULT_COUNTRY,
    req as NextApiRequest,
    res as NextApiResponse
  );

  country = countryDetail?.code;

  console.log("country", country, countryDetail);
  const pricelist = countryDetail?.default_price_list;

  const data: IProductDetail = await productAPI(
    idNumber,
    countryDetail?.code,
    pricelist,
    req as NextApiRequest,
    res as NextApiResponse
  );

  const productRating = await productRatingAPI(
    id as string,
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  const productReviews = await productReviewListAPI(
    id as string,
    country as string,
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  if (!data) {
    return {
      notFound: true,
    };
  } else if (data.slug && data.slug !== slug) {
    return {
      redirect: {
        destination: `/product/${id}/${data.slug}`,
        permanent: true,
      },
    };
  }

  return {
    props: {
      data,
      country,
      pricelist,
      productRating,
      productReviews,
      countryDetail,
      ...(await serverSideTranslations(locale as string, [
        "product",
        "review",
        ...serverRuntimeConfig.commoni18NameSpaces,
      ])),
    },
  };
};

export default ProductPage;
