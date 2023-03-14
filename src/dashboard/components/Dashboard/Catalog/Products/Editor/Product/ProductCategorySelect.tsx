// next.js
// react
import { useState } from "react";
// mui
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
const ProductCategorySelect = () => {
  // simple select with categories
  const [categoryId, setCategoryId] = useState<string>("");

  const handleChange = (event: SelectChangeEvent) => {
    setCategoryId(event.target.value as string);
  };
  return (
    <EditorCard>
      <Typography variant="h6">Category</Typography>
      <Box mt={2}>
        <FormControl fullWidth>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={categoryId}
            label="Category"
            onChange={handleChange}
          >
            <MenuItem value={"0"}>Men</MenuItem>
            <MenuItem value={"1"}>Women</MenuItem>
            <MenuItem value={"2"}>Kids</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </EditorCard>
  );
};
export default ProductCategorySelect;
