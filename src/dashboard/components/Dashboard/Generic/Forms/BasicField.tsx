import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { ChangeEvent } from "react";

export interface IBasicFieldProps {
  value: string;
  setter: (value: string) => void;
  isRequired?: boolean;
  label?: string;
}

interface IBasicSelectOption {
  code: string;
  name: string;
}

interface IBasicSelectProps {
  props: IBasicFieldProps;
  options: IBasicSelectOption[];
  disabled?: boolean;
}

export const BasicSelect = ({
  props,
  options,
  disabled,
}: IBasicSelectProps) => {
  return (
    <Box pt={2} pr={2}>
      <TextField
        id="outlined-select-currency"
        select
        label={props.label}
        value={props.value}
        defaultValue={props.value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (disabled) {
            return;
          }
          props.setter(e.target.value);
        }}
        variant="outlined"
        fullWidth
        disabled={disabled}
        required={props.isRequired || false}
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

const BasicField = ({ props }: { props: IBasicFieldProps }) => {
  return (
    <Box pt={2} pr={2}>
      <TextField
        id="first-name"
        label={props.label}
        variant="outlined"
        value={props.value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          props.setter(e.target.value);
        }}
        fullWidth
        sx={{
          display: "block",
        }}
        required={props.isRequired || false}
      />
    </Box>
  );
};

export default BasicField;
