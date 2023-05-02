/**
 * /pages/index.tsx
 * This is the home page of the site
 */

// react
import React from "react";
// components
import Slider from "@/components/Slider/Slider";
// mui
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// styles
import styles from "@/styles/Homepage/Homepage.module.scss";
import Grid from "@mui/material/Grid";
import CompanyBenefit from "@/components/Homepage/CompanyBenefit";
import { IProductSliderData } from "@/types/product";
import ProductsSlider from "@/components/Common/ProductsSlider";

const bestSellersData: IProductSliderData[] = [
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

const HomePage = () => {
  return (
    <div className={`container`}>
      <div className={styles.homePage}>
        <Slider />
        <Box sx={{ pt: 5 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to our ecommerce store!
          </Typography>
          <Typography variant="body1" gutterBottom>
            We offer a wide selection of products for all your needs.
          </Typography>
        </Box>
        <Box sx={{ pt: 5 }}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ sm: 3, md: 3, lg: 12 }}
          >
            <Grid item md={3}>
              <CompanyBenefit title="Over 20 years" subtitle="of experience" />
            </Grid>
            <Grid item md={3}>
              <CompanyBenefit title="100 000 products" subtitle="in stock" />
            </Grid>
            <Grid item md={3}>
              <CompanyBenefit
                title="Free shipping"
                subtitle="for orders over $100"
              />
            </Grid>
            <Grid item md={3}>
              <CompanyBenefit title="24/7" subtitle="customer service" />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ pt: 5 }}>
          <Typography variant="h4" gutterBottom>
            Best sellers
          </Typography>
          <Typography variant="body1" gutterBottom>
            Check out our best selling products
          </Typography>
          <ProductsSlider data={bestSellersData} />
        </Box>
      </div>
    </div>
  );
};

export default HomePage;
