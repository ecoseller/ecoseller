import getConfig from "next/config";
// utils
import { useTranslation } from "next-i18next";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import CartItemList from "@/components/Cart/CartItemList";
import CartStepper from "@/components/Cart/Stepper";
import CartButtonRow from "@/components/Cart/ButtonRow";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useCart } from "@/utils/context/cart";
import { IProductSliderData } from "@/types/product";
import { useRecommender } from "@/utils/context/recommender";
import ProductsSlider from "@/components/Common/ProductsSlider";

const { serverRuntimeConfig } = getConfig();

const CartPage = () => {
  const router = useRouter();
  const { cart } = useCart();
  const { t } = useTranslation("cart");
  const [recommendedProducts, setRecommendedProducts] = React.useState<
    IProductSliderData[]
  >([]);

  const { getRecommendations } = useRecommender();
  useEffect(() => {
    // load recommended products
    getRecommendations("CART", {
      limit: 10,
      skus: cart?.cart_items.map((item) => item.product_variant_sku),
    }).then((products: any[]) => {
      setRecommendedProducts(products);
    });
  }, []);

  return (
    <div className="container">
      <CartStepper activeStep={0} />
      <Typography variant="h4" sx={{ my: 3 }}>
        {t("cart-title")}
      </Typography>
      {cart ? <CartItemList editable={true} cart={cart} /> : null}
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
      <ProductsSlider data={recommendedProducts || []} />
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
