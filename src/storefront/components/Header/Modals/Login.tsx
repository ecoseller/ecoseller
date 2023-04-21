/**
 * /components/Header/Modals/Login.tsx
 * Login modal component for the header menu
 * Its fired from outside (see props) and it opens user login modal
 */

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  outline: 0,
  boxShadow: 24,
  p: 4,
};

interface ILoginModal {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const LoginModal = ({ open, setOpen }: ILoginModal) => {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Login
        </Typography>
      </Box>
    </Modal>
  );
};

export default LoginModal;
