import { ICart } from "@/types/cart";
import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import { cartDetailAPI } from "@/pages/api/cart/[token]";
import { useCart } from "@/utils/context/cart";
import Typography from "@mui/material/Typography";
import React from "react";
import Box from "@mui/material/Box";

const CartPage = () => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="container">
      <Typography variant="h4" sx={{ my: 3 }}>
        Cart
      </Typography>
      {cart ? (
        <table>
          {cart.cart_items.map((item) => (
            <tr key={item.product_variant}>
              <td>{item.product_variant}</td>
              <td>{item.unit_price_gross}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </table>
      ) : (
        <Typography variant="h6">No items</Typography>
      )}
    </div>
  );
};

export default CartPage;
