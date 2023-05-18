import { useCart } from "@/utils/context/cart";
import Typography from "@mui/material/Typography";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

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
            <tr key={item.product_variant_sku}>
              <td>{item.product_variant_name}</td>
              <td>{item.unit_price_gross}</td>
              <td>{item.quantity}</td>
              <td>
                <IconButton
                  onClick={() => removeFromCart(item.product_variant_sku)}
                >
                  <DeleteIcon />
                </IconButton>
              </td>
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
