import { IValidatedInputField } from "@/types/common";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { ChangeEvent } from "react";

interface IBasicSelectOption {
  code: string;
  name: string;
}
export interface IBasicSelect {
  field: IValidatedInputField;
  options: IBasicSelectOption[];
  disabled?: boolean;
}

export const BasicSelect = ({ field, options, disabled }: IBasicSelect) => {
  console.log("options", options);
  return (
    <Box pt={2} pr={2}>
      <TextField
        id="outlined-select-currency"
        select
        label={field?.label}
        value={field?.value}
        defaultValue={field?.value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (disabled) {
            return;
          }
          field.setter(e.target.value);
        }}
        variant="outlined"
        fullWidth
        disabled={disabled}
      >
        {options.map((option) => (
          <MenuItem key={option.code} value={option.code}>
            {option.name}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export const TwoFieldsOneRowWrapper = ({
  children,
}: {
  children: JSX.Element[];
}) => {
  if (children.length !== 2)
    throw new Error("TwoFieldsOneRowWrapper must have exactly two children");
  return (
    <Grid
      container
      spacing={{ xs: 1, md: 1 }}
      columns={{ xs: 4, sm: 12, md: 12 }}
    >
      <Grid item xs={4} sm={6} md={6}>
        {children[0]}
      </Grid>
      <Grid item xs={4} sm={6} md={6}>
        {children[1]}
      </Grid>
    </Grid>
  );
};

const BasicField = ({ field }: { field: IValidatedInputField }) => {
  return (
    <Box pt={2} pr={2}>
      <TextField
        label={field?.label || ""}
        variant="outlined"
        value={field?.value || ""}
        onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          field.setter(e.target.value);
          if (field.validator && field.setIsValid) {
            field.setIsValid(field.validator(e.target.value));
          }
        }}
        error={field?.isValid === false}
        helperText={!field.isValid ? field?.errorMessage : ""}
        fullWidth
        sx={{
          display: "block",
        }}
      />
    </Box>
  );
};

export default BasicField;
