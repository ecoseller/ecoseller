import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const steps = [
  "Cart",
  "Shipping & billing info",
  "Shipping & payment method",
  "Order summary",
];

interface ICartStepper {
  activeStep: number;
}

const CartStepper = ({ activeStep }: ICartStepper) => {
  return (
    <Box sx={{ width: "100%" }} pt={4} pb={2}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default CartStepper;
