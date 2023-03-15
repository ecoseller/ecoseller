import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import { ActionSetProduct, ISetProductStateData } from "@/types/product";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { ISetProductStateAction } from "../ProductEditorWrapper";

interface IProductMediaEditorProps {
  state: ISetProductStateData;
  dispatch: React.Dispatch<ISetProductStateAction>;
}

const ProductVisibilitySelect = ({
  state,
  dispatch,
}: IProductMediaEditorProps) => {
  return (
    <EditorCard>
      <Typography variant="h6">Visibility</Typography>
      <Box mt={2}>
        <FormControlLabel
          control={<Checkbox checked={state.published} />}
          onClick={() => {
            dispatch({
              type: ActionSetProduct.SETPUBLISHED,
              payload: { published: !state.published },
            });
          }}
          label="Published"
        />
      </Box>
    </EditorCard>
  );
};

export default ProductVisibilitySelect;
