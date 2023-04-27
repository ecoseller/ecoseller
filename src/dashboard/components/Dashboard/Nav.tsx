// react
import { useEffect } from "react";
// next.js
import { useRouter } from "next/router";
// mui
import styled from "@mui/material/styles/styled";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// utils
import useResponsive from "../../utils/responsive";
import navigationData from "../../utils/navigationData";
// components
import Navigation from "./Navigation/Navigation";
import Logo from "../Logo";
import Scrollbar from "./Navigation/Scrollbar";
import { useUser } from "@/utils/context/user";
import { IGroup } from "@/types/user";

const NAV_WIDTH = 280;

const StyledAccount = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: "rgba(142, 68, 173, 0.08)",
}));

interface IDashboardNavProps {
  openNav: boolean;
  onCloseNav: () => void;
}
const DashboardNav = ({ openNav, onCloseNav }: IDashboardNavProps) => {
  const { pathname } = useRouter();

  const { user, roles } = useUser();

  const isDesktop = useResponsive("up", "lg", "lg");

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ px: 2.5, py: 5, display: "inline-flex" }}>
        <Logo />
      </Box>

      <Navigation data={navigationData} />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <StyledAccount>
          <AccountCircleIcon />
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
              {user?.email}
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {roles?.map((role: IGroup) => role.name).join(", ")}
            </Typography>
          </Box>
        </StyledAccount>
      </Box>
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH / 2 - 7 },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: "background.default",
              borderRightColor: "#E6E8EA",
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
};

export default DashboardNav;
