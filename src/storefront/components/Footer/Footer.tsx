// react
import { useEffect, useState } from "react";
//next.js
import { useRouter } from "next/router";
import Image from "next/image";
// mui
import styled from "@mui/material/styles/styled";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import Logo from "../Logo";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 100;
const INFO_HEADER_DESKTOP = 45;
const INFO_HEADER_MOBILE = 25;
const MAXWIDTH = 1620;

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  width: "100%",
  [theme.breakpoints.up("lg")]: {
    minHeight: HEADER_DESKTOP,
    maxWidth: MAXWIDTH,
  },
  marginRight: "auto",
  marginLeft: "auto",
}));

const Footer = () => {
  return (
    <Box
      sx={{
        marginTop: "calc(10% + 60px)",
        bottom: 0,
        width: "100%",
        height: "60px",
        position: "relative",

        pl: 5,
        backgroundColor: "#222222",
      }}
      component="footer"
    >
      <Typography
        variant="body2"
        color="white"
        align="left"
        style={{
          textDecoration: "none",
          fontSize: "0.75rem",
          color: "#ffffff",
          // align to vertical center
          position: "absolute",
          top: "50%",
          transform: "translateY(-50 %)",
          msTransform: "translateY(-50 %)",
        }}
        component={Link}
        href="https://ecoseller.io/"
      >
        {"© "}
        ecoseller.io
        {` ${new Date().getFullYear()}.`}
      </Typography>
    </Box>
  );
};

export default Footer;
