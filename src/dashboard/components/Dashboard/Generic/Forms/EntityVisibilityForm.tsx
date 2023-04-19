import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import { ActionSetProduct, ISetProductStateData } from "@/types/product";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { ISetProductStateAction } from "../../Catalog/Products/Editor/ProductEditorWrapper";
import React from "react";

interface IEntityVisibilityFormProps {
  isPublished: boolean;
  setValue: (isPublished: boolean) => void
}

/**
 * Component containing form used for entity visibility.
 * 
 * It contains 
 * - `Visibility` heading
 * - single checkbox with `Published` label 
 *
 * @param isPublished determines if the entity is currently published
 * @param setValue function to call when checkbox value changes
 * @constructor
 */
const EntityVisibilityForm = ({
  isPublished,
  setValue
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
                setValue(!isPublished);
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
