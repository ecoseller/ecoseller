// next
import { useRouter } from "next/router";

// react
import {
  ChangeEvent,
  ChangeEventHandler,
  use,
  useEffect,
  useState,
} from "react";

// libs
import { useCart } from "@/utils/context/cart";

// components

// mui
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Button from "@mui/material/Button";
// types
import { IProductVariant } from "@/types/product";
import Grid from "@mui/material/Grid";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { serializeAttributes } from "@/utils/attributes";
import QuantitySelect from "@/components/Common/QuantitySelect";

const StockQuantity = ({ quantity }: { quantity: number }) => {
  if (quantity > 5) {
    return <span style={{ color: "green" }}>In Stock</span>;
  } else if (quantity > 0) {
    return <span style={{ color: "orange" }}>Low Stock</span>;
  } else {
    return <span style={{ color: "red" }}>Out of Stock</span>;
  }
};

const ProductVariantRow = ({
  variant,
  productId,
  country,
  pricelist,
}: {
  variant: IProductVariant;
  productId: number;
  country: string;
  pricelist: string;
}) => {
  const { addToCart } = useCart();
  const { query } = useRouter();

  const [qty, setQty] = useState(1);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  console.log("qty", qty, productId);
  return (
    <Grid
      container
      spacing={{ xs: 4, md: 4, lg: 4 }}
      // columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
      // pt={4}
      mb={4}
    >
      <Grid container item xs={5} sm={3} md={4} lg={3} direction="column">
        <Typography variant="body1">
          {serializeAttributes(variant.attributes)}
        </Typography>
        <Typography variant="body2">{variant.sku}</Typography>
      </Grid>
      <Grid container item xs={2} sm={2} md={3} lg={2}>
        <Typography>
          <StockQuantity quantity={variant.stock_quantity} />
        </Typography>
      </Grid>
      <Grid container item xs={5} sm={3} md={4} lg={2}>
        <Typography>
          {variant?.price?.discount
            ? variant?.price?.discount.incl_vat
            : variant?.price?.incl_vat}{" "}
          {variant?.price?.discount ? (
            <span
              className="red-text"
              style={{
                fontSize: "0.8rem",
              }}
            >
              (-{variant?.price?.discount?.percentage} %)
            </span>
          ) : null}
        </Typography>
      </Grid>
      <Grid container item xs={6} sm={3} md={4} lg={2}>
        <QuantitySelect
          quantity={qty}
          setQuantity={setQty}
          maxQuantity={variant.stock_quantity}
        />
        {/* <Typography>Select qty</Typography> */}
      </Grid>
      <Grid
        container
        item
        xs={6}
        sm={1}
        md={4}
        lg={2}
        alignItems="center"
        spacing={2}
      >
        <Button
          variant="text"
          startIcon={<ShoppingCartIcon />}
          onClick={() => {
            addToCart(variant.sku, qty, productId, pricelist, country);
            setQty(1);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ProductVariantRow;
