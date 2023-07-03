// utils
import { useTranslation } from "next-i18next";
import Typography from "@mui/material/Typography";
import React from "react";
import CartItemList from "@/components/Cart/CartItemList";
import CartStepper from "@/components/Cart/Stepper";
import CartButtonRow from "@/components/Cart/ButtonRow";
import { useRouter } from "next/router";

const CartPage = () => {
  const router = useRouter();
  const { t } = useTranslation("cart");
  return (
    <div className="container">
      <CartStepper activeStep={0} />
      <Typography variant="h4" sx={{ my: 3 }}>
        {t("cart-title")}
      </Typography>
      <CartItemList editable={true} />
      <CartButtonRow
        prev={{
          title: t("common:back"),
          onClick: () => {
            router.back();
          },
          disabled: true,
        }}
        next={{
          title: t("common:next"),
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
