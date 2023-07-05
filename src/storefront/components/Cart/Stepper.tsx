// utils
import { useTranslation } from "next-i18next";
import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

interface ICartStepper {
  activeStep: number;
}

const CartStepper = ({ activeStep }: ICartStepper) => {
  const { t } = useTranslation("cart");

  const steps = [
    t("step-1-cart"),
    t("step-2-shipping-billing-info"),
    t("step-2-shipping-payment-method"),
    t("step-2-summary"),
  ];
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
