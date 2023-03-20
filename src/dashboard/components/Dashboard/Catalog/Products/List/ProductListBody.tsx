import { IProductListItem } from "@/types/product";
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface IProductListBody {
  products: IProductListItem[] | undefined;
}

const ProductListBody = ({ products }: IProductListBody) => {
  return (
    <TableBody>
      {products?.map((product) => (
        <TableRow key={product.id}>
          <TableCell>
            <Checkbox />
          </TableCell>
          <TableCell>{product.id}</TableCell>
          <TableCell>{product.title}</TableCell>
          <TableCell>{product.published}</TableCell>
          <TableCell>{product.update_at}</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default ProductListBody;
