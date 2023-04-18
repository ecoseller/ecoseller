import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import { ActionSetProduct, ISetProductStateData } from "@/types/product";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { ISetProductStateAction } from "../Catalog/Products/Editor/ProductEditorWrapper";
import React from "react";

interface IEntityVisibilityFormProps {
  isPublished: boolean;
  dispatch: React.Dispatch<{ type: any; payload: { published: boolean } }>;
  dispatchType: any;
}

/**
 * Component containing form used for entity visibility.
 * 
 * It contains 
 * - `Visibility` heading
 * - single checkbox with `Published` label 
 *
 * @param isPublished determines if the entity is currently published
 * @param dispatch dispatch function to call when state changes
 * @param dispatchType type property that is passed to `dispatch` function when it's called
 * @constructor
 */
const EntityVisibilityForm = ({
  isPublished,
  dispatch,
  dispatchType,
}: IEntityVisibilityFormProps) => {
  return (
    <EditorCard>
      <Typography variant="h6">Visibility</Typography>
      <Box mt={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isPublished}
              onClick={() => {
                dispatch({
                  type: dispatchType,
                  payload: { published: !isPublished },
                });
              }}
            />
          }
          label="Published"
        />
      </Box>
    </EditorCard>
  );
};

export default EntityVisibilityForm;
