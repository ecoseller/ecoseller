import { IValidatedInputField } from "@/types/common";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ChangeEvent } from "react";

const BasicField = ({ field }: { field: IValidatedInputField }) => {
  return (
    <Box pt={2} pr={2}>
      <TextField
        id="first-name"
        label={field.label}
        variant="outlined"
        value={field.value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          field.setter(e.target.value);
          if (field.validator && field.setIsValid) {
            field.setIsValid(field.validator(e.target.value));
          }
        }}
        error={field.isValid === false}
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
