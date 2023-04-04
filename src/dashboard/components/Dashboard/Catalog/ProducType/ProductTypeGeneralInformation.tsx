// next.js
// react
import { ChangeEvent, useState } from "react";
// mui
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import { TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import {
  ActionSetProduct,
  IProduct,
  IProductType,
  ISetProductStateData,
} from "@/types/product";

interface IProductTypeNameProps {
  state: IProductType;
  setState: (data: IProductType) => void;
}

const ProductTypeGeneralInformation = ({
  state,
  setState,
}: IProductTypeNameProps) => {
  // simple select with categories

  return (
    <EditorCard>
      <Typography variant="h6">General information</Typography>
      <Box mt={2}>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={state?.name}
              // disabled={true}
              onChange={(
                event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                setState({
                  ...state,
                  name: event.target.value,
                });
              }}
              InputLabelProps={{
                shrink: Boolean(state?.id),
              }}
            />
            {/* <TextField label="Name" /> */}
          </Stack>
        </FormControl>
      </Box>
    </EditorCard>
  );
};
export default ProductTypeGeneralInformation;
