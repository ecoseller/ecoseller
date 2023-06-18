/**
 * /components/Header/Header.tsx
 * Header component for the main layout
 */

// react
import { useState } from "react";
//next.js
// mui
import styled from "@mui/material/styles/styled";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";
import TopLine from "./TopLine";
import InfoBar from "./InfoBar";
// components
import Menu from "./MegaMenu/Menu";
import User from "./Icons/User";
import Cart from "./Icons/Cart";
import SearchButton from "./Icons/Search";
// utils
// styles
import styles from "@/styles/Header.module.scss";

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 100;
const INFO_HEADER_DESKTOP = 45;
const INFO_HEADER_MOBILE = 25;
const MAXWIDTH = 1620;

const StyledRoot = styled(AppBar)(({ theme }: { theme: any }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  boxShadow: "none",
  borderBottom: "1px solid #e0e0e0",
  position: "relative",
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  width: "100%",
  [theme.breakpoints.up("lg")]: {
    minHeight: HEADER_DESKTOP,
    maxWidth: MAXWIDTH,
  },
  margin: "0px auto",
  paddingLeft: "1rem",
  paddingRight: 0,
}));

const InfoToolBarNarrow = styled(Toolbar)(({ theme }) => ({
  maxWidth: MAXWIDTH,
}));

interface IDashboardHeaderProps {}
const DashboardHeader = ({}: IDashboardHeaderProps) => {
  const theme = useTheme();
  const mobileScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <StyledRoot>
      <InfoBar text="Free shipping on all orders over $100" />
      <TopLine />
      <div className={"container"}>
        <Box>
          <StyledToolbar disableGutters>
            <Menu />
            <Box sx={{ flexGrow: 1 }} />
            <Stack
              direction="row"
              alignItems="center"
              spacing={{
                xs: 5,
                sm: 5,
              }}
            >
              <SearchButton
                mobile={mobileScreen}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
              />
              {!mobileOpen ? (
                <>
                  <User />
                  <Cart />
                </>
              ) : null}
            </Stack>
          </StyledToolbar>
        </Box>
      </div>
    </StyledRoot>
  );
};

export default DashboardHeader;
