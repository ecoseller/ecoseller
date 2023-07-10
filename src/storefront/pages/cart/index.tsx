import getConfig from "next/config";
// utils
import { useTranslation } from "next-i18next";
import Typography from "@mui/material/Typography";
import React from "react";
import CartItemList from "@/components/Cart/CartItemList";
import CartStepper from "@/components/Cart/Stepper";
import CartButtonRow from "@/components/Cart/ButtonRow";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useCart } from "@/utils/context/cart";

const { serverRuntimeConfig } = getConfig();

const CartPage = () => {
  const router = useRouter();
  const { cart } = useCart();
  const { t } = useTranslation("cart");

  return (
    <div className="container">
      <CartStepper activeStep={0} />
      <Typography variant="h4" sx={{ my: 3 }}>
        {t("cart-title")}
      </Typography>
      {cart ? (
        <CartItemList editable={true} cart={cart} showClaimsColumn={false} />
      ) : null}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "cart",
        ...serverRuntimeConfig.commoni18NameSpaces,
      ])),
    },
  };
};

export default CartPage;
