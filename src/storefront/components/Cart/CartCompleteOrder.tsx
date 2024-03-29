import { ICart } from "@/types/cart";
// utils
import { useTranslation } from "next-i18next";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import { useRouter } from "next/router";
import { orderSubmitAPI } from "@/api/order/submit";
import { useSnackbarState } from "@/utils/snackbar";
import { useCart } from "@/utils/context/cart";
import Cookies from "js-cookie";
import { RS_SESSION_COOKIE } from "@/utils/context/recommender";

interface ICartCompleteOrderProps {
  cart: ICart;
}

/**
 * Component displaying total price of an order and `Complete order` button
 * @param cart
 * @constructor
 */
const CartCompleteOrder = ({ cart }: ICartCompleteOrderProps) => {
  const { t } = useTranslation("order");

  const [agreeWithTerms, setAgreeWithTerms] = useState(false);
  const [agreeWithDataProcessing, setAgreeWithDataProcessing] = useState(false);
  const [snackbar, setSnackbar] = useSnackbarState();
  const { clearCart } = useCart();
  const router = useRouter();
  const rsSession = Cookies.get(RS_SESSION_COOKIE);

  return (
    <>
      <Divider />
      <FormControl sx={{ m: 3 }} variant="standard">
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={agreeWithTerms}
                onChange={() => setAgreeWithTerms(!agreeWithTerms)}
                name="terms"
              />
            }
            label={t("agree-with-terms-and-conditions")}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={agreeWithDataProcessing}
                onChange={() =>
                  setAgreeWithDataProcessing(!agreeWithDataProcessing)
                }
                name="processing"
              />
            }
            label={t("agree-with-usage-of-contact-information-for-marketing")}
          />
        </FormGroup>
      </FormControl>
      <Divider />
      <Typography variant="h5" sx={{ my: 3 }}>
        {
          t("cart:total-price-incl-price", {
            price: cart.total_price_incl_vat_formatted,
          }) /**Total price:&nbsp; */
        }
        {/* Total price: {cart.total_price_incl_vat_formatted} */}
      </Typography>
      <>
        <Button
          variant="contained"
          startIcon={<ShoppingCartCheckoutIcon />}
          size="large"
          disabled={!agreeWithTerms}
          onClick={async () => {
            const response = await orderSubmitAPI(
              cart.token,
              {
                agreeWithTerms: agreeWithTerms,
                agreeWithDataProcessing: agreeWithDataProcessing,
              },
              rsSession
            );

            const data = await response.json();
            if (response.status != 201) {
              console.log("complete order", data?.error);
              setSnackbar({
                open: true,
                message: data?.error,
                severity: "error",
              });
              return;
            }
            setSnackbar({
              open: true,
              message: t("order-completed"),
              severity: "success",
            });
            clearCart();
            router.push(`/order/${data?.token}/completed`);
          }}
        >
          {t("complete-order")}
        </Button>
      </>
    </>
  );
};

export default CartCompleteOrder;
