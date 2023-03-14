import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import { IProductVariant } from "@/types/product";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
interface IProductVariantTable extends IProductVariant {
  edit: boolean;
}
interface IProductVariantsEditorProps {
  disabled: boolean;
}

const ProductVariantsEditor = ({ disabled }: IProductVariantsEditorProps) => {
  const [variants, setVariants] = useState<IProductVariantTable[]>([
    {
      sku: "123",
      ean: "123",
      weight: 123,
      edit: false,
    },
    {
      sku: "124",
      ean: "124",
      weight: 123,
      edit: false,
    },
    {
      sku: "125",
      ean: "125",
      weight: 123,
      edit: false,
    },
  ]);

  return (
    <EditorCard>
      <CollapsableContentWithTitle title="Variants">
        {disabled ? (
          <Typography variant="body1" color="textSecondary">
            Adding or editing product variants will be available after first
            save.
          </Typography>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table
              size="small"
              sx={{ minWidth: 650 }}
              aria-label="product-variant-minimal-table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell>EAN</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {variants.map((variant) => (
                  <TableRow
                    key={variant.sku}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {variant.sku}
                    </TableCell>
                    <TableCell>{variant.ean}</TableCell>
                    <TableCell>{variant.weight}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="edit"
                        onClick={() => {
                          setVariants((prev) =>
                            prev.map((v) =>
                              v.sku === variant.sku
                                ? { ...v, edit: !v.edit }
                                : v
                            )
                          );
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          setVariants((prev) =>
                            prev.filter((v) => v.sku !== variant.sku)
                          );
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};

export default ProductVariantsEditor;
