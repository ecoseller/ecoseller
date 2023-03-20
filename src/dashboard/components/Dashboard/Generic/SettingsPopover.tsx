import Popover from "@mui/material/Popover";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface ISettingsPopoverProps {
  children: React.ReactNode;
}

const SettingsPopover = ({ children, ...props }: ISettingsPopoverProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "settings-popover" : undefined;

  return (
    <>
      <Button variant="text" onClick={handleClick}>
        <SettingsIcon />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>{children}</Box>
      </Popover>
    </>
  );
};

export default SettingsPopover;
