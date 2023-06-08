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
          onClick={() => {
            router.push("/order/completed");
          }}
        >
          Complete order
        </Button>
      </>
    </>
  );
};

export default CartCompleteOrder;
