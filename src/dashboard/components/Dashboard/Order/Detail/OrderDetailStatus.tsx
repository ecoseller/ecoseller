import React from "react";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { OrderStatus } from "@/types/order";
import { usePermission } from "@/utils/context/permission";
import Stack from "@mui/material/Stack";

interface IOrderDetailStatusProps {
  orderStatus: OrderStatus;
  createdAt: string;
  paymentId: string | null;
  setOrderStatus: (orderStatus: OrderStatus) => void;
}

const OrderDetailStatus = ({
  orderStatus,
  createdAt,
  paymentId,
  setOrderStatus,
}: IOrderDetailStatusProps) => {
  const { hasPermission } = usePermission();

  const statuses = [
    OrderStatus.Pending,
    OrderStatus.Processing,
    OrderStatus.Shipped,
    OrderStatus.Cancelled,
  ];

  const handleChange = (event: SelectChangeEvent) => {
    const newStatus = event.target.value as OrderStatus;
    setOrderStatus(newStatus);
  };

  return (
    <EditorCard>
      <Typography variant="h6">Status</Typography>
      <Stack direction="column" spacing={2} mt={2}>
        <>
          <FormControl fullWidth>
            <InputLabel id="order-status-label">Status</InputLabel>
            <Select
              labelId="order-status-label"
              value={orderStatus}
              onChange={handleChange}
              label="Status"
              disabled={!hasPermission}
            >
              {statuses?.map((status) => {
                return (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </>
        <div>Created at: {createdAt}</div>
        <div>
          {paymentId ? <>Payment ID: {paymentId}</> : <>Waiting for payment</>}
        </div>
      </Stack>
    </EditorCard>
  );
};
export default OrderDetailStatus;
