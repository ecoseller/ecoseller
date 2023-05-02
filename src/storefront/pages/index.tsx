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
import styles from "@/styles/HomePage/HomePage.module.scss";

const HomePage = () => {
  return (
    <div className={`container`}>
      <div className={styles.homePage}>
        <Slider />
        <Box sx={{ p: 5 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to our ecommerce store!
          </Typography>
          <Typography variant="body1" gutterBottom>
            We offer a wide selection of products for all your needs.
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default HomePage;
