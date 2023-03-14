import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import Typography from "@mui/material/Typography";

interface IProductVariantPriceEditorProps {
  disabled: boolean;
}

const ProductVariantPricesEditor = ({
  disabled,
}: IProductVariantPriceEditorProps) => {
  return (
    <EditorCard>
      <CollapsableContentWithTitle title="Prices">
        {disabled ? (
          <Typography variant="body1" color="textSecondary">
            Adding or editing product variant prices will be available after
            first save.
          </Typography>
        ) : (
          <Typography variant="body1" color="textSecondary">
            Add product variant prices here.
          </Typography>
        )}
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};

export default ProductVariantPricesEditor;
