import { useEffect, useState } from "react";
// @mui
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";

// Cookies
// @ts-ignore
import Cookies from "js-cookie";

// next.js
import { useRouter } from "next/router";

// Axios
import { axiosPrivate } from "@/utils/axiosPrivate";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useUser } from "@/utils/context/user";


const AccountPopover = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [id, setId] = useState<string | undefined>(undefined);

  const router = useRouter();

  const { user, roles } = useUser();

  useEffect(() => {
    setId(Boolean(anchorEl) ? "avatar-popover" : undefined);
  }, [anchorEl]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const refreshToken = Cookies.get("refreshToken") || null;
    if (refreshToken != null) {
      axiosPrivate.post("/user/logout", {
        refresh: refreshToken,
      });
    }
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    setAnchorEl(null);

    router.replace("/login");
  };

  const handleProfile = () => {
    router.replace(`/dashboard/users-roles/edit-user/${user?.email}`);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          p: 0,
        }}
      >
        <AccountCircleIcon />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            "& .MuiMenuItem-root": {
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
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

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
};

export default AccountPopover;
