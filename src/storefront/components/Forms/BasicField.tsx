import { IValidatedInputField } from "@/types/common";
import TextField from "@mui/material/TextField";
import { ChangeEvent } from "react";

const BasicField = ({ field }: { field: IValidatedInputField }) => {
  return (
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
    />
  );
};

export default BasicField;
