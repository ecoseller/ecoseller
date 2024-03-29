import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Grid, TableCell, TableRow } from "@mui/material";
import { IShippingPaymentMethod } from "@/types/cart";
import imgPath from "@/utils/imgPath";
import ImageThumbnail from "@/components/Generic/ImageThumbnail";

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
        {method.image ? (
          <ImageThumbnail
            imagePath={imgPath(method.image)}
            alt={method.title}
          />
        ) : null}
      </TableCell>
      <TableCell>{method.title}</TableCell>
      <TableCell align="center" sx={{ fontWeight: "bold" }}>
        {formattedPrice}
      </TableCell>
    </TableRow>
  );
};
export default CartMethodSummaryInfoRow;
