// next.js
// react
import { ChangeEvent, useState } from "react";
// mui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import { FormHelperText, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
// types
import { IAttributeType, TAttributeTypeValueType } from "@/types/product";

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
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="value-type-label">Type</InputLabel>
              <Select
                labelId="value-type-label"
                id="value-type-select"
                value={state?.value_type}
                label="Age"
                onChange={(event: SelectChangeEvent) => {
                  let value = event.target.value as TAttributeTypeValueType;

                  setState({
                    ...state,
                    value_type: value,
                  });
                }}
                disabled={state?.base_attributes?.length > 0}
              >
                <MenuItem value={"TEXT"}>Text</MenuItem>
                <MenuItem value={"INTEGER"}>Integer</MenuItem>
                <MenuItem value={"DECIMAL"}>Decimal</MenuItem>
              </Select>
              <FormHelperText>
                Expected type of the value. If you select numerical values,
                ecoseller will take care order the values correctly and even
                determine distances between values. But you can change it only
                if there are no values for this type.
              </FormHelperText>
            </FormControl>
          </Stack>
        </FormControl>
      </Box>
    </EditorCard>
  );
};
export default AttributeTypeGeneralInformation;
