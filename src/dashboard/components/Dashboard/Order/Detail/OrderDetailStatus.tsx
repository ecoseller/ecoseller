import React from "react";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ICategoryLocalized } from "@/types/category";
import { OrderStatus } from "@/types/order";
import { updateOrderStatus } from "@/api/order/order";

interface IOrderDetailStatusProps {
  orderStatus: OrderStatus;
  setOrderStatus: (orderStatus: OrderStatus) => void;
}

const OrderDetailStatus = ({
  orderStatus,
  setOrderStatus,
}: IOrderDetailStatusProps) => {
  // const { hasPermission } = usePermission();

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
      <Box mt={2}>
        <FormControl fullWidth>
          <InputLabel id="order-status-label">Status</InputLabel>
          <Select
            labelId="order-status-label"
            value={orderStatus}
            // disabled={!hasPermission}
            onChange={handleChange}
            label="Status"
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
      </Box>
    </EditorCard>
  );
};
export default OrderDetailStatus;
