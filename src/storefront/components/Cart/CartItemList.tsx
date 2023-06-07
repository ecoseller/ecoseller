import { useCart } from "@/utils/context/cart";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { ICart, ICartItem } from "@/types/cart";
import { Grid, Table, TableBody, TableCell, TableRow } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import imgPath from "@/utils/imgPath";
import TableHead from "@mui/material/TableHead";
import ImageThumbnail from "@/components/Generic/ImageThumbnail";
import NextLink from "next/link";
import MUILink from "@mui/material/Link";

interface ICartItemListProps {
  editable: boolean;
}

const CartItemList = ({ editable }: ICartItemListProps) => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const updateItemQuantity = (item: ICartItem, addingOne: boolean = true) => {
    if (!addingOne && item.quantity == 1) {
      return;
    }

    const diff = addingOne ? 1 : -1;
    updateQuantity(item.product_variant_sku, item.quantity + diff);
  };

  return cart ? (
    <>
      <Table sx={{ minWidth: 650 }}>
        {editable ? null : (
          <TableHead>
            <TableCell align="center">Product</TableCell>
            <TableCell align="center">Image</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="center">Discount</TableCell>
            <TableCell align="center">Total price</TableCell>
          </TableHead>
        )}
        <TableBody>
          {cart.cart_items.map((item) => (
            <TableRow key={item.product_variant_sku}>
              <TableCell align="center">
                <NextLink
                  href={`/product/${item.product_id}/${item.product_slug}`}
                >
                  <MUILink underline="none">
                    {item.product_variant_name}
                  </MUILink>
                </NextLink>
              </TableCell>

              <TableCell align="center">
                {item.primary_image ? (
                  <ImageThumbnail
                    imagePath={imgPath(item.primary_image.media, true)}
                    alt={item.primary_image.alt || ""}
                  />
                ) : null}
              </TableCell>

              <TableCell align="center">
                {editable ? (
                  <IconButton
                    onClick={() => {
                      updateItemQuantity(item, false);
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                ) : null}

                {item.quantity}

                {editable ? (
                  <IconButton
                    onClick={() => {
                      updateItemQuantity(item, true);
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                ) : null}
              </TableCell>

              <TableCell align="center" sx={{ fontWeight: 700 }}>
                {item.discount ? (
                  <span className="red-text">-{item.discount} %</span>
                ) : null}
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }} align="center">
                {item.total_price_net_formatted}
              </TableCell>

              {editable ? (
                <TableCell align="center">
                  <IconButton
                    onClick={() => {
                      removeFromCart(item.product_variant_sku);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editable ? (
        <Grid container justifyContent="center" sx={{ my: 3 }}>
          <Grid item>
            <Typography variant="h6">
              Total price:&nbsp;{cart.total_items_price_net_formatted}
            </Typography>
          </Grid>
        </Grid>
      ) : null}
    </>
  ) : (
    <Typography variant="h6" sx={{ my: 3 }}>
      No items
    </Typography>
  );
};

export default CartItemList;
