// next

// react

// libs

// components

// mui
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// types
import { IProductVariant } from "@/types/product";

interface IProductVariantsProps {
  variants: IProductVariant[];
}

const ProductVariants = ({ variants }: IProductVariantsProps) => {
  /**
   * Purpose of this component is to display all the variants of a product and allow the user to select one of them to add to the cart.
   */

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        {/* <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead> */}
        <TableBody>
          {variants.map((variant: IProductVariant) => (
            <TableRow
              key={variant.sku}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {variant.sku} - attributes
              </TableCell>
              <TableCell align="right">{variant.availability}</TableCell>
              <TableCell align="right">{variant.price} / pc</TableCell>
              <TableCell align="right">Select qty</TableCell>
              <TableCell align="right">add to cart</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductVariants;
