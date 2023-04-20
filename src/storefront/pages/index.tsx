import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
// components
import Header from "@/components/Header/Header";

const HomePage = () => {
  return (
    <>
      <Header />
      <Box sx={{ p: 5 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to our ecommerce store!
        </Typography>
        <Typography variant="body1" gutterBottom>
          We offer a wide selection of products for all your needs.
        </Typography>
      </Box>
    </>
  );
};

export default HomePage;
