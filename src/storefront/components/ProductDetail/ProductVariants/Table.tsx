// next

// react

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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// types
import { IProductVariant } from "@/types/product";
import ProductVariantRow from "./Row";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";

interface IProductVariantsProps {
  variants: IProductVariant[];
  productId: number;
  country: string;
  pricelist: string;
}
const ProductVariants = ({
  variants,
  productId,
  country,
  pricelist,
}: IProductVariantsProps) => {
  /**
   * Purpose of this component is to display all the variants of a product and allow the user to select one of them to add to the cart.
   */

  return (
    <Grid container columns={{ xs: 12, sm: 12, md: 12, lg: 12 }} pt={4}>
      {variants.map((variant: IProductVariant, index: number) => (
        <>
          <ProductVariantRow
            key={variant.sku}
            variant={variant}
            productId={productId}
            country={country}
            pricelist={pricelist}
          />
          {/* {index < variants.length - 1 ? <Divider /> : null} */}
        </>
      ))}
    </Grid>
  );
};

export default ProductVariants;
