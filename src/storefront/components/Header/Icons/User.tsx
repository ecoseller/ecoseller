/**
 * /components/Header/Icons/User.tsx
 * User icon component for the header menu
 * It opens login modal if user is not logged in (null) and opens user menu if user is logged in (not null)
 */

// react
import { useEffect, useState } from "react";
// mui
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";

import LoginModal from "../Modals/Login";
import { Box, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { IUser } from "@/types/user";

const User = () => {
  const [anchorUserMenuEl, setAnchorUserMenuEl] = useState<null | HTMLElement>(
    null
  );
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [refetch, setRefetch] = useState<boolean>(false);

  const router = useRouter();

  const openUserMenu = Boolean(anchorUserMenuEl);
  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorUserMenuEl(event.currentTarget);
  };
  const handleUserMenuClose = () => {
    setAnchorUserMenuEl(null);
  };

  useEffect(() => {
    const refreshToken = Cookies.get("refreshToken") || null;
    if (refreshToken == null) {
      setUser(null);
      return;
    }
    fetch(`/api/user/detail`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.email === undefined) {
          setUser(null);
          return;
        }
        setUser({
          email: data?.email,
          first_name: data?.first_name,
          last_name: data?.last_name,
        } as IUser);
      });
  }, [openLoginModal, refetch]);

  const handleProfile = () => {
    router.push(`/user/detail`);
  };

  const handleOrders = () => {
    router.replace(`/user/orders`);
  };

  const handleLogout = () => {
    const refreshToken = Cookies.get("refreshToken") || null;
    if (refreshToken != null) {
      fetch("/api/user/logout", {
        method: "POST",
        body: JSON.stringify({ refresh: refreshToken }),
      });
    }
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    setAnchorUserMenuEl(null);
    router.replace("/");
    setRefetch(!refetch);
  };

  return (
    <>
      {user ? (
        <IconButton
          onClick={handleUserMenuClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={openUserMenu ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openUserMenu ? "true" : undefined}
        >
          <PersonIcon />
        </IconButton>
      ) : (
        <IconButton
          onClick={() => {
            setOpenLoginModal(true);
          }}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={openUserMenu ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openUserMenu ? "true" : undefined}
        >
          <PersonIcon />
        </IconButton>
      )}
      <LoginModal open={openLoginModal} setOpen={setOpenLoginModal} />
      <Menu
        anchorEl={anchorUserMenuEl}
        id="account-menu"
        open={openUserMenu}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.first_name} {user?.last_name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user?.email}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: "#E6E8EA" }} />
        <MenuItem onClick={handleProfile} sx={{ m: 1 }}>
          Profile
        </MenuItem>
        <MenuItem onClick={handleOrders} sx={{ m: 1 }}>
          Orders
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default User;
