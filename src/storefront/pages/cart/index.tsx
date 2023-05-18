import { useCart } from "@/utils/context/cart";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { ICart, ICartItem } from "@/types/cart";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import Paper from "@mui/material/Paper";
import imgPath from "@/utils/imgPath";

const CartPage = () => {
  const { getCart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [cartState, setCartState] = useState<ICart | null>(getCart());
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

  return (
    <div className="container">
      <Typography variant="h4" sx={{ my: 3 }}>
        Cart
      </Typography>
      {cartState ? (
        <>
          <Table sx={{ minWidth: 650 }}>
            <TableBody>
              {cartState.cart_items.map((item) => (
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
                    <IconButton onClick={() => {}}>
                      <AddIcon />
                    </IconButton>
                    {item.quantity}
                    <IconButton onClick={() => {}}>
                      <RemoveIcon />
                    </IconButton>
                  </TableCell>

                  <TableCell align="center">
                    {item.discount ? (
                      <span className="red-text">-{item.discount} %</span>
                    ) : null}
                  </TableCell>

                  <TableCell align="center">
                    {getPriceString(
                      roundedPrice(item),
                      cartState.currency_symbol,
                      cartState.symbol_position
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      onClick={async () => {
                        await removeFromCart(item.product_variant_sku);
                        setCartState(getCart());
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
                  getTotalPrice(cartState.cart_items),
                  cartState.currency_symbol,
                  cartState.symbol_position
                )}
              </Typography>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography variant="h6" sx={{ my: 3 }}>
          No items
        </Typography>
      )}
    </div>
  );
};

export default CartPage;
