import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Grid, TableCell, TableRow } from "@mui/material";
import { IShippingPaymentMethod } from "@/types/cart";
import imgPath from "@/utils/imgPath";

interface ICartMethodSummaryInfoRowProps {
  method: IShippingPaymentMethod;
  formattedPrice: string;
}

const CartMethodSummaryInfoRow = ({
  method,
  formattedPrice,
}: ICartMethodSummaryInfoRowProps) => {
  return (
    <TableRow>
      <TableCell align="center">
        <img
          src={imgPath(method.image)}
          alt={method.title}
          style={{
            objectFit: "contain",
            position: "relative",
            height: "50px",
            width: "auto",
          }}
        />
      </TableCell>
      <TableCell>{method.title}</TableCell>
      <TableCell align="center" sx={{ fontWeight: "bold" }}>
        {formattedPrice}
      </TableCell>
    </TableRow>
  );
};
export default CartMethodSummaryInfoRow;
