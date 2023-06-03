import React from "react";
import Typography from "@mui/material/Typography";
import { ITranslatedMethodBase } from "@/types/cart/methods";
import { Box, Grid } from "@mui/material";

interface IOrderDetailMethodsProps {
  method: ITranslatedMethodBase;
  formattedPrice: string;
}

const OrderDetailMethod = ({
  method,
  formattedPrice,
}: IOrderDetailMethodsProps) => {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "primary.main",
        my: 3,
      }}
    >
      <Grid
        container
        spacing={{ xs: 1, md: 1 }}
        columns={{ xs: 4, sm: 8 }}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={1} sm={2} md={2}>
          <img
            src={method.image}
            alt={method.title}
            style={{
              width: "auto",
              height: "auto",
              maxHeight: "30px",
              maxWidth: "70px",
            }}
          />
        </Grid>
        <Grid item xs={1} sm={4}>
          <Typography variant="body1" sx={{ mt: 1, pl: 2 }}>
            {method.title}
          </Typography>
        </Grid>
        <Grid item xs={1} sm={2} md={2}>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {formattedPrice}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
export default OrderDetailMethod;
