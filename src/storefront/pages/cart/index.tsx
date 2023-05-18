import Typography from "@mui/material/Typography";
import React from "react";
import CartItemList from "@/components/Cart/CartItemList";

const CartPage = () => {
  return (
    <div className="container">
      <Typography variant="h4" sx={{ my: 3 }}>
        Cart
      </Typography>
      <CartItemList />
    </div>
  );
};

export default CartPage;
