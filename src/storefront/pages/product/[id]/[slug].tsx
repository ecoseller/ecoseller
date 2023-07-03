// next
import { useRouter } from "next/router";
import Link from "next/link";

// react

// libs
import { productAPI } from "@/pages/api/product/[id]";
import EditorJsOutput from "@/utils/editorjs/EditorJsOutput";

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
import { IProductDetail, IProductSliderData } from "@/types/product";
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
} from "next/types";
import { countryDetailAPI } from "@/pages/api/country/[code]";
import { ICountry } from "@/types/country";
import BreadcrumbCategoryNav from "@/components/Common/BreadcrumbCategoryNav";
import { DEFAULT_COUNTRY } from "@/utils/defaults";
import { useRecommender } from "@/utils/context/recommender";
import { useState } from "react";

interface IProductPageProps {
  data: IProductDetail;
  country: string;
  pricelist: string;
}

const ProductPage = ({ data, country, pricelist }: IProductPageProps) => {
  const { basePath } = useRouter();
  const { getRecommendations } = useRecommender();

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
                Variants
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
            Recommended products
          </Typography>
          <Typography variant="body1" gutterBottom>
            Check out our best selling products
          </Typography>
          <ProductsSlider
            data={getRecommendations("view_product", {
              product_id: data.id,
            })}
          />
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

  console.log(data);

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
    },
  };
};

export default ProductPage;
