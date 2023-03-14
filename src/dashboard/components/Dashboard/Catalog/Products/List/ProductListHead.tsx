import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface IProductListHead {
  rowsCount: number;
  rowsSelected: number;
  onSelectAllClick: () => void;
}

const ProductListHead = ({
  rowsCount,
  rowsSelected,
  onSelectAllClick,
}: IProductListHead) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <Checkbox
            indeterminate={rowsSelected > 0 && rowsSelected < rowsCount}
            checked={rowsCount > 0 && rowsSelected === rowsCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        <TableCell>ID</TableCell>
        <TableCell>Name</TableCell>
        <TableCell>Visibility</TableCell>
        <TableCell>Last updated</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default ProductListHead;
