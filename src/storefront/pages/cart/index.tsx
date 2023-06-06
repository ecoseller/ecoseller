import Typography from "@mui/material/Typography";
import React from "react";
import CartItemList from "@/components/Cart/CartItemList";
import CartStepper from "@/components/Cart/Stepper";
import CartButtonRow from "@/components/Cart/ButtonRow";
import { useRouter } from "next/router";

const CartPage = () => {
  const router = useRouter();

  return (
    <div className="container">
      <CartStepper activeStep={0} />
      <Typography variant="h4" sx={{ my: 3 }}>
        Cart
      </Typography>
      <CartItemList editable={true} />
      <CartButtonRow
        prev={{
          title: "Back",
          onClick: () => {
            router.back();
          },
          disabled: true,
        }}
        next={{
          title: "Next",
          onClick: () => {
            router.push("/cart/step/1");
          },
          disabled: false,
        }}
      />
    </div>
  );
};

export default CartPage;
