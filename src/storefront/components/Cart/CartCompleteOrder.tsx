import { ICart } from "@/types/cart";
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

interface ICartCompleteOrderProps {
  cart: ICart;
}

/**
 * Component displaying total price of an order and `Complete order` button
 * @param cart
 * @constructor
 */
const CartCompleteOrder = ({ cart }: ICartCompleteOrderProps) => {
  const [agreeWithTerms, setAgreeWithTerms] = useState(false);
  const [agreeWithDataProcessing, setAgreeWithDataProcessing] = useState(false);
  const [snackbar, setSnackbar] = useSnackbarState();
  const { clearCart } = useCart();
  const router = useRouter();

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
            label="I agree with terms and conditions"
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
            label="I agree with usage of contact information for marketing reasons"
          />
        </FormGroup>
      </FormControl>
      <Divider />
      <Typography variant="h5" sx={{ my: 3 }}>
        Total price: {cart.total_price_net_formatted}
      </Typography>
      <>
        <Button
          variant="contained"
          startIcon={<ShoppingCartCheckoutIcon />}
          size="large"
          disabled={!agreeWithTerms}
          onClick={async () => {
            const response = await orderSubmitAPI(cart.token, {
              agreeWithTerms: agreeWithTerms,
              agreeWithDataProcessing: agreeWithDataProcessing,
            });

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
              message: "Order completed",
              severity: "success",
            });
            console.log("complete order", response, data?.token);
            clearCart();
            router.push(`/order/${data?.token}/completed`);
            // router.push("/order/completed");
          }}
        >
          Complete order
        </Button>
      </>
    </>
  );
};

export default CartCompleteOrder;
