// mui
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
// types
import { IPaymentMethodCountry } from "@/types/cart";

export interface IPaymentMethodItemProps {
  id: number;
  title: string;
  image: string;
  price_incl_vat: string;
  selected: boolean;
  setSelected: (id: number) => void;
}

const PaymentMethodItem = ({
  id,
  title,
  image,
  price_incl_vat,
  selected,
  setSelected,
}: IPaymentMethodItemProps) => {
  /**
   * Payment method item component
   * This components is currently 1:1 with the ShippingMethodItem
   * component. However, it's done so that in the future, if we
   * want to implement some pickup point selector or something like
   * that, we can do it in it without affecting the payment method
   */

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

interface IPaymentMethodListProps {
  methods: IPaymentMethodCountry[];
  selected: number | null;
  setSelected: (id: number) => void;
}

const PaymentMethodList = ({
  methods,
  selected,
  setSelected,
}: IPaymentMethodListProps) => {
  return (
    <>
      {methods?.map((method: IPaymentMethodCountry) => (
        <PaymentMethodItem
          key={method.id}
          id={method.id}
          title={method.payment_method.title}
          image={method.payment_method.image}
          price_incl_vat={method.price_incl_vat}
          selected={selected === method.id}
          setSelected={setSelected}
        />
      ))}
    </>
  );
};

export default PaymentMethodList;
