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
import Cookies from "js-cookie";

// next.js
import { useRouter } from "next/router";

// Axios
import { axiosPrivate } from "@/utils/axiosPrivate";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const MENU_OPTIONS = [
  {
    label: "Profile",
    icon: "eva:person-fill",
  },
];

const AccountPopover = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [id, setId] = useState<string | undefined>(undefined);

  const router = useRouter();

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
            John Doe
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            jdoe@example.com
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "#E6E8EA" }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
};

export default AccountPopover;
