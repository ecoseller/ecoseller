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
// components
// utils

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
}));

const StyledInfoToolbar = styled(Toolbar)(({ theme }) => ({
  width: "100%",
  backgroundColor: "#f5f5f5",
  [theme.breakpoints.up("lg")]: {
    height: "20px",
  },
}));

const InfoToolBarNarrow = styled(Toolbar)(({ theme }) => ({
  maxWidth: MAXWIDTH,
}));

interface IDashboardHeaderProps {}
const DashboardHeader = ({}: IDashboardHeaderProps) => {
  const theme = useTheme();
  const largeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  const onOpenMobileMenu = () => {
    setOpenMobileMenu(true);
  };
  const onCloseMobileMenu = () => {
    setOpenMobileMenu(false);
  };

  return (
    <StyledRoot>
      <StyledInfoToolbar>
        <InfoToolBarNarrow sx={{}}>
          <Stack
            direction="row"
            alignItems="left"
            spacing={{
              xs: 5,
              sm: 5,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ flexGrow: 1 }}
              component={Link}
              href="/contact"
              shallow={false}
              prefetch={false}
              style={{
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              Contact
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ flexGrow: 1 }}
              component={Link}
              href="/category"
              shallow={false}
              prefetch={false}
              style={{
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              Return & Exchange
            </Typography>
          </Stack>
        </InfoToolBarNarrow>
      </StyledInfoToolbar>
      <StyledToolbar>
        <IconButton
          onClick={onOpenMobileMenu}
          sx={{
            color: "text.primary",
            display: { lg: "none" },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Link href="/" shallow={false} prefetch={false}>
          <div
            style={{
              width: largeScreen ? `150px` : `100px`,
              height: `40px`,
              flexShrink: 0,
              cursor: `pointer`,
              position: `relative`,
            }}
          >
            <Image
              alt={`logo`}
              src={`/logo/main.svg`}
              style={{
                objectFit: `contain`,
                objectPosition: `left center`,
              }}
              fill
              sizes="100vw"
              priority
            />
          </div>
        </Link>
        {largeScreen ? (
          <>
            <Box sx={{ mr: 5 }} />
            <Stack
              direction="row"
              alignItems="center"
              spacing={{
                xs: 0.5,
                sm: 5,
              }}
            >
              <Typography
                variant="body1"
                sx={{ flexGrow: 1 }}
                component={Link}
                href="/category"
                shallow={false}
                prefetch={false}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                Category 1
              </Typography>
              <Typography
                variant="body1"
                sx={{ flexGrow: 1 }}
                component={Link}
                href="/category"
                shallow={false}
                prefetch={false}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                Category 2
              </Typography>
              <Typography
                variant="body1"
                sx={{ flexGrow: 1 }}
                component={Link}
                href="/category"
                shallow={false}
                prefetch={false}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                Category 3
              </Typography>
              <Typography
                variant="body1"
                sx={{ flexGrow: 1 }}
                component={Link}
                href="/category"
                shallow={false}
                prefetch={false}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                Category 4
              </Typography>
            </Stack>
          </>
        ) : null}
        <Box sx={{ flexGrow: 1 }} />
        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 5,
            sm: 5,
          }}
        >
          <SearchIcon />
          <PersonIcon />
          <Badge badgeContent={0} color="primary">
            <ShoppingCartIcon />
          </Badge>
        </Stack>
      </StyledToolbar>
      {largeScreen ? null : (
        <Drawer
          open={openMobileMenu}
          onClose={onCloseMobileMenu}
          PaperProps={{
            sx: {
              width: "80%",
              bgcolor: "background.default",
              borderRightColor: "#E6E8EA",
            },
          }}
        ></Drawer>
      )}
    </StyledRoot>
  );
};

export default DashboardHeader;
