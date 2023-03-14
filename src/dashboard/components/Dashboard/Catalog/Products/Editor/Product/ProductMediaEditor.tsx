import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import Typography from "@mui/material/Typography";

interface IProductMediaEditorProps {
  disabled: boolean;
}

const ProductMediaEditor = ({ disabled }: IProductMediaEditorProps) => {
  return (
    <EditorCard>
      <CollapsableContentWithTitle title="Media">
        {disabled ? (
          <Typography variant="body1" color="textSecondary">
            Adding or editing product medai will be available after first save.
          </Typography>
        ) : (
          <Typography variant="body1" color="textSecondary">
            Add product media here.
          </Typography>
        )}
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};

export default ProductMediaEditor;
