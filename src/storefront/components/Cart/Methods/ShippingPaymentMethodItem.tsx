// mui
import { Box, Radio, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

export interface IShippingPaymentMethodItemProps {
  id: number;
  title: string;
  image: string;
  price_incl_vat: string;
  selected: boolean;
  setSelected: (id: number) => void;
}

const ShippingPaymentMethodItem = ({
  id,
  title,
  image,
  price_incl_vat,
  selected,
  setSelected,
}: IShippingPaymentMethodItemProps) => {
  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: !selected ? "grey.300" : "primary.main",
        borderRadius: 1,
        mb: 2,
      }}
    >
      <Grid
        container
        spacing={{ xs: 1, md: 1 }}
        columns={{ xs: 4, sm: 12, md: 12 }}
        alignItems="center"
        justifyContent="center"
        onClick={() => setSelected(id)}
      >
        <Grid item xs={1} sm={1} md={1}>
          <Radio checked={selected} />
        </Grid>
        <Grid item xs={1} sm={2} md={2}>
          <img
            src={image}
            alt={title}
            style={{
              width: "auto",
              height: "auto",
              maxHeight: "30px",
              maxWidth: "70px",
            }}
          />
        </Grid>
        <Grid item xs={1} sm={6} md={7}>
          <Typography variant="h6" sx={{ mt: 1, pl: 2 }}>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={1} sm={2} md={2}>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {price_incl_vat}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShippingPaymentMethodItem;
