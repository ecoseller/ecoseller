// next.js
// react
import { ChangeEvent, useState } from "react";
// mui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import { TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import { IAttributeType } from "@/types/product";

interface AttributeTypeGeneralProps {
  state: IAttributeType;
  setState: (data: IAttributeType) => void;
}

const AttributeTypeGeneralInformation = ({
  state,
  setState,
}: AttributeTypeGeneralProps) => {
  // simple select with categories

  return (
    <EditorCard>
      <Typography variant="h6">General information</Typography>
      <Box mt={2}>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={state?.type_name}
              // disabled={true}
              onChange={(
                event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                setState({
                  ...state,
                  type_name: event.target.value,
                });
              }}
              InputLabelProps={{
                shrink: Boolean(state?.id),
              }}
            />
            <TextField
              label="Unit"
              value={state?.unit}
              // disabled={true}
              onChange={(
                event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                setState({
                  ...state,
                  unit: event.target.value,
                });
              }}
              InputLabelProps={{
                shrink: Boolean(state?.id),
              }}
            />
          </Stack>
        </FormControl>
      </Box>
    </EditorCard>
  );
};
export default AttributeTypeGeneralInformation;
