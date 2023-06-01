/**
 * /components/Header/Icons/User.tsx
 * User icon component for the header menu
 * It opens login modal if user is not logged in (null) and opens user menu if user is logged in (not null)
 */

// react
import { useState } from "react";
// mui
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";

import LoginModal from "../Modals/Login";
import { useUser } from "@/utils/context/user";


const User = () => {
  const [anchorUserMenuEl, setAnchorUserMenuEl] = useState<null | HTMLElement>(
    null
  );
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const { user } = useUser();
  console.log("USER", user);

  const openUserMenu = Boolean(anchorUserMenuEl);
  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorUserMenuEl(event.currentTarget);
  };
  const handleUserMenuClose = () => {
    setAnchorUserMenuEl(null);
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
        <MenuItem>Profile</MenuItem>
        <MenuItem>Orders</MenuItem>
        <Divider />
        <MenuItem>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default User;
