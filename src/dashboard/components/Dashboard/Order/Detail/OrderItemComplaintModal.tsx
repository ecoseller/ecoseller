import React, { useState } from "react";
import {
  IOrderItemComplaint,
  OrderItemComplaintStatus,
  OrderItemComplaintType,
  OrderStatus,
} from "@/types/order";
import { Box, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { usePermission } from "@/utils/context/permission";
import { updateOrderItemComplaintStatus } from "@/api/order/order";

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
  orderItemSku: string;
  orderItemComplaint: IOrderItemComplaint;
  openModalLinkText: string;
}

const OrderItemComplaintModal = ({
  orderItemSku,
  orderItemComplaint,
  openModalLinkText,
}: IOrderItemClaimModalProps) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(orderItemComplaint.status);

  const { hasPermission } = usePermission();

  const availableStatuses = [
    OrderItemComplaintStatus.CREATED,
    OrderItemComplaintStatus.APPROVED,
    OrderItemComplaintStatus.DECLINED,
  ];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setStatus(orderItemComplaint.status);
    setOpen(false);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    const newStatus = event.target.value as OrderItemComplaintStatus;
    setStatus(newStatus);
  };

  const handleSubmit = async () => {
    await updateOrderItemComplaintStatus(orderItemComplaint.id, status);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen}>{openModalLinkText}</Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5">
            {orderItemComplaint.type == OrderItemComplaintType.WARRANTY_CLAIM
              ? "Item's warranty claimed"
              : "Item Returned"}
          </Typography>
          <Stack spacing={3}>
            <div>SKU:&nbsp;{orderItemSku}</div>
            <div>
              <div>
                <b>Description</b>
              </div>
              <div>{orderItemComplaint.description}</div>
            </div>
            <FormControl>
              <InputLabel id="complaint-status-label">Status</InputLabel>
              <Select
                labelId="complaint-status-label"
                value={status}
                onChange={handleStatusChange}
                label="Status"
                disabled={!hasPermission}
              >
                {availableStatuses?.map((status) => {
                  return (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <div>
              <Button variant="contained" onClick={handleSubmit}>
                Save
              </Button>
            </div>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default OrderItemComplaintModal;
