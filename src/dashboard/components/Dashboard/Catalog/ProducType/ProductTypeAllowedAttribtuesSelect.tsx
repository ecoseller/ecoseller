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
import {
  Checkbox,
  ListItemText,
  OutlinedInput,
  TextField,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import {
  ActionSetProduct,
  IAttributeType,
  IProduct,
  IProductType,
  ISetProductStateData,
} from "@/types/product";

interface IProductTypeNameProps {
  state: IProductType;
  attributeTypes: IAttributeType[];
  setState: (data: IProductType) => void;
}

const ProductTypeAllowedAttribtuesSelect = ({
  state,
  attributeTypes,
  setState,
}: IProductTypeNameProps) => {
  // simple select with categories

  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;

    let val = [];
    if (!value) return;
    if (typeof value === "string") {
      let arr = value.split(",");
      val = arr.map((v) => parseInt(v));
    } else {
      val = value;
    }
    setState({
      ...state,
      allowed_attribute_types_ids: val,
    });
  };

  return (
    <EditorCard>
      <Typography variant="h6">Allowed attributes</Typography>
      <Box mt={2}>
        <FormControl fullWidth>
          <InputLabel id="allowed-attributes-label">
            Allowed attributes
          </InputLabel>
          <Select
            labelId="allowed-attributes-label"
            id="allowed-attributes-select"
            multiple
            value={state?.allowed_attribute_types_ids}
            onChange={handleChange}
            input={<OutlinedInput label="Allowed attributes" />}
            renderValue={(selected) =>
              attributeTypes

                ?.filter((attribute: IAttributeType) =>
                  selected?.includes(attribute.id)
                )
                ?.map((attribute: IAttributeType) => attribute.type_name)
                .join(", ")
            }
          >
            {attributeTypes.map((attribute) => (
              <MenuItem key={attribute.id} value={attribute.id}>
                <Checkbox
                  checked={state?.allowed_attribute_types_ids?.includes(
                    attribute.id
                  )}
                />
                <ListItemText primary={attribute?.type_name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </EditorCard>
  );
};
export default ProductTypeAllowedAttribtuesSelect;
