import React, { useState } from "react";
import {
  IOrderItemComplaintCreate,
  OrderItemComplaintType,
} from "@/types/order";
import { Box, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { createOrderItemComplaint } from "@/api/order/complaint";
import { useTranslation } from "next-i18next";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface IOrderItemClaimModalProps {
  cartItemName: string;
  orderId: string;
  cartItemId: number;
  claimType: OrderItemComplaintType;
  openModalLinkText: string;
}

const OrderItemClaimModal = ({
  cartItemName,
  orderId,
  cartItemId,
  claimType,
  openModalLinkText,
}: IOrderItemClaimModalProps) => {
  const { t } = useTranslation(["order", "common"]);

  const [open, setOpen] = useState(false);
  const [orderItemClaim, setOrderItemClaim] =
    useState<IOrderItemComplaintCreate>({
      cart_item: cartItemId,
      order: orderId,
      type: claimType,
      description: "",
    });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const setDescription = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setOrderItemClaim({ ...orderItemClaim, description: event.target.value });
  };

  const handleSubmit = () => {
    createOrderItemComplaint(orderItemClaim).then((_) => handleClose());
  };

  return (
    <>
      <Button onClick={handleOpen}>{openModalLinkText}</Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6">
            {claimType == OrderItemComplaintType.WARRANTY_CLAIM
              ? t("claim-items-warranty")
              : t("return-item")}
          </Typography>
          <div>{cartItemName}</div>
          <form>
            <TextField
              label={t("common:description")}
              multiline={true}
              value={orderItemClaim.description}
              onChange={(event) => setDescription(event)}
              required
              sx={{ my: 3, width: "100%" }}
              rows={4}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {t("common:send")}
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default OrderItemClaimModal;
