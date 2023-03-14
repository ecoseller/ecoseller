import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import Typography from "@mui/material/Typography";

interface IProductVariantsEditorProps {
  disabled: boolean;
}

const ProductVariantsEditor = ({ disabled }: IProductVariantsEditorProps) => {
  return (
    <EditorCard>
      <CollapsableContentWithTitle title="Variants">
        {disabled ? (
          <Typography variant="body1" color="textSecondary">
            Adding or editing product variants will be available after first
            save.
          </Typography>
        ) : (
          <Typography variant="body1" color="textSecondary">
            Add product variants here.
          </Typography>
        )}
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};

export default ProductVariantsEditor;
