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

const CartItemList = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const roundedPrice = (item: ICartItem) => {
    const price = item.quantity * item.unit_price_net;
    return Math.round(price * 100) / 100;
  };

  const getPriceString = (
    price: number,
    currencySymbol: string,
    symbolPosition: "BEFORE" | "AFTER"
  ) => {
    if (symbolPosition == "BEFORE") {
      return `${currencySymbol} ${price}`;
    } else {
      return `${price} ${currencySymbol}`;
    }
  };

  const getTotalPrice = (items: ICartItem[]) => {
    const itemPrices = items.map((i) => i.unit_price_net * i.quantity);
    return itemPrices.reduce((x, y) => x + y);
  };

  const updateItemQuantity = async (
    item: ICartItem,
    addingOne: boolean = true
  ) => {
    if (!addingOne && item.quantity == 1) {
      return;
    }

    const diff = addingOne ? 1 : -1;
    await updateQuantity(item.product_variant_sku, item.quantity + diff);
  };

  return cart ? (
    <>
      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {cart.cart_items.map((item) => (
            <TableRow key={item.product_variant_sku}>
              <TableCell align="center">
                <Button
                  onClick={() =>
                    router.push(
                      `/product/${item.product_id}/${item.product_slug}`
                    )
                  }
                >
                  {item.product_variant_name}
                </Button>
              </TableCell>

              {item.primary_image ? (
                <TableCell>
                  <img
                    src={imgPath(item.primary_image.media)}
                    alt={item.primary_image.alt || ""}
                    style={{
                      objectFit: "contain",
                      position: "relative",
                      height: "50px",
                      width: "auto",
                    }}
                  />
                </TableCell>
              ) : null}

              <TableCell align="center">
                <IconButton
                  onClick={async () => {
                    await updateItemQuantity(item, true);
                  }}
                >
                  <AddIcon />
                </IconButton>
                {item.quantity}
                <IconButton
                  onClick={async () => {
                    await updateItemQuantity(item, false);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </TableCell>

              <TableCell align="center" sx={{ fontWeight: 700 }}>
                {item.discount ? (
                  <span className="red-text">-{item.discount} %</span>
                ) : null}
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }} align="center">
                {getPriceString(
                  roundedPrice(item),
                  cart.currency_symbol,
                  cart.symbol_position
                )}
              </TableCell>

              <TableCell align="center">
                <IconButton
                  onClick={() => {
                    removeFromCart(item.product_variant_sku);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Grid container justifyContent="center" sx={{ my: 3 }}>
        <Grid item>
          <Typography variant="h6">
            Total price:&nbsp;
            {getPriceString(
              getTotalPrice(cart.cart_items),
              cart.currency_symbol,
              cart.symbol_position
            )}
          </Typography>
        </Grid>
      </Grid>
    </>
  ) : (
    <Typography variant="h6" sx={{ my: 3 }}>
      No items
    </Typography>
  );
};

export default CartItemList;
