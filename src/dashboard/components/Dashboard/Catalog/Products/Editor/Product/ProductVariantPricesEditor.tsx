import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import { ISetProductStateData } from "@/types/product";
import Typography from "@mui/material/Typography";
import { ISetProductStateAction } from "../ProductEditorWrapper";

interface IProductVariantPriceEditorProps {
  disabled: boolean;
  state: ISetProductStateData;
  dispatch: React.Dispatch<ISetProductStateAction>;
}

const ProductVariantPricesEditor = ({
  disabled,
  state,
  dispatch,
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
