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
import { IProduct, IProductSliderData } from "@/types/product";
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
} from "next/types";

interface IProductPageProps {
  data: IProduct;
  country: string;
  pricelist: string;
}

const recommendedProducts: IProductSliderData[] = [
  {
    id: 1,
    title: "Product 1",
    price: "$25",
    image: "/images/products/1.jpg",
    url: "/",
  },
  {
    id: 2,
    title: "Product 2",
    price: "$20",
    image: "/images/products/2.jpg",
    url: "/",
  },
  {
    id: 3,
    title: "Product 3",
    price: "$25",
    image: "/images/products/1.jpg",
    url: "/",
  },
  {
    id: 4,
    title: "Product 4",
    price: "$20",
    image: "/images/products/1.jpg",
    url: "/",
  },
  {
    id: 5,
    title: "Product 5",
    price: "$25",
    image: "/images/products/1.jpg",
    url: "/",
  },
  {
    id: 6,
    title: "Product 6",
    price: "$20",
    image: "/images/products/1.jpg",
    url: "/",
  },
];

const ProductPage = ({ data, country, pricelist }: IProductPageProps) => {
  const { basePath } = useRouter();

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
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            pt: 2,
          }}
        >
          {data?.breadcrumbs?.map((item, index) => (
            <Link
              key={index}
              href={{
                pathname: `/category/${item.id}/${item.slug}`,
              }}
            >
              {item.title}
            </Link>
          ))}
          <Link
            href={{
              pathname: `/product/${data.id}/${data.slug}`,
            }}
          >
            {
              /**
               * Crop title to 20 characters
               */
              data.title.length > 20
                ? `${data.title.substring(0, 20)}...`
                : data.title
            }
          </Link>
        </Breadcrumbs>
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
          <ProductsSlider data={recommendedProducts} />
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

  const country = "cz";
  const pricelist = "CZK_maloobchod";

  const data: IProduct = await productAPI(
    idNumber,
    country,
    pricelist,
    req as NextApiRequest,
    res as NextApiResponse,
    language
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
