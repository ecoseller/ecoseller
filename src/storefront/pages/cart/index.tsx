import { useCart } from "@/utils/context/cart";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { ICart, ICartItem } from "@/types/cart";
import {
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

const CartPage = () => {
  const { getCart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [cartState, setCartState] = useState<ICart | null>(getCart());
  const router = useRouter();

  const getItemPriceString = (
    cartItem: ICartItem,
    currencySymbol: string,
    symbolPosition: "BEFORE" | "AFTER"
  ) => {
    const price = cartItem.quantity * cartItem.unit_price_net;
    const priceRounded = Math.round(price * 100) / 100;
    if (symbolPosition == "BEFORE") {
      return `${currencySymbol} ${priceRounded}`;
    } else {
      return `${priceRounded} ${currencySymbol}`;
    }
  };

  return (
    <div className="container">
      <Typography variant="h4" sx={{ my: 3 }}>
        Cart
      </Typography>
      {cartState ? (
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

                <TableCell align="center">
                  {item.discount ? (
                    <span className="red-text">-{item.discount} %</span>
                  ) : null}
                </TableCell>

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
                  <b>
                    {getItemPriceString(
                      item,
                      cartState.currency_symbol,
                      cartState.symbol_position
                    )}
                  </b>
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
      ) : (
        <Typography variant="h6">No items</Typography>
      )}
    </div>
  );
};

export default CartPage;
