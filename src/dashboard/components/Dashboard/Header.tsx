// react
import { useEffect, useState } from "react";
//next.js
import { useRouter } from "next/router";
// mui
import styled from "@mui/material/styles/styled";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AccountPopover from "./Header/AccountPopover";
import MenuIcon from "@mui/icons-material/Menu";
import { alpha } from "@mui/material/styles";
import { Typography } from "@mui/material";
// components
// utils
import navigationData, { INavigationItem } from "../../utils/navigationData";

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const BLUR = 6;
const OPACITY = 0.8;

const StyledRoot = styled(AppBar)(({ theme }: { theme: any }) => ({
  //   bgBlur({ color: theme.palette.background.default }),
  //   backdropFilter: `blur(${BLUR}px)`,
  //   WebkitBackdropFilter: `blur(${BLUR}px)`,
  backgroundColor: alpha(
    theme.palette.background.default || "#000000",
    OPACITY
  ),
  color: theme.palette.text.primary,
  boxShadow: "none",
  [theme.breakpoints.up("lg")]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up("lg")]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

interface IDashboardHeaderProps {
  onOpenNav: () => void;
}
const DashboardHeader = ({ onOpenNav }: IDashboardHeaderProps) => {
  const [activeTitle, setActiveTitle] = useState<string | null>(null);

  const { pathname } = useRouter();

  useEffect(() => {
    let fullPathFound: Boolean = false;
    let activeLevel = navigationData.find((item: INavigationItem) =>
      pathname.includes(item.path)
    );

    if (activeLevel && activeLevel.path == pathname) {
      // not a sub level
      setActiveTitle(activeLevel.title);
      return;
    } else if (!activeLevel) {
      // not even a subpath found on the first level
      setActiveTitle(null);
      return;
    }
    let title = activeLevel.title;
    // don't have full path yet
    while (!fullPathFound) {
      if (activeLevel && activeLevel.children) {
        activeLevel = activeLevel.children.find((item: INavigationItem) =>
          pathname.includes(item.path)
        );
      } else {
        // no more children
        fullPathFound = true;
        break;
      }
      title += ` / ${activeLevel?.title}`;
    }

    setActiveTitle(title);

  }, [pathname]);

  console.log("activeTitle", activeTitle);

  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: "text.primary",
            display: { lg: "none" },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h5">{activeTitle || "Dashboard"}</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
};

export default DashboardHeader;
