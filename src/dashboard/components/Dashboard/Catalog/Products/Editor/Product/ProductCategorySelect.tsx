// next.js
// react
import { useState } from "react";
//libs
import useSWRImmutable from "swr/immutable";
// components
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
// mui
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ActionSetProduct, ISetProductStateData } from "@/types/product";
import { ISetProductStateAction } from "../ProductEditorWrapper";
import { ICategoryLocalized } from "@/types/category";

interface IProductMediaEditorProps {
  state: ISetProductStateData;
  dispatch: React.Dispatch<ISetProductStateAction>;
}

const ProductCategorySelect = ({
  state,
  dispatch,
}: IProductMediaEditorProps) => {
  // simple select with categories
  // const [categoryId, setCategoryId] = useState<string>("");

  const { data: categories } = useSWRImmutable("/category/");

  const setCategoryId = (id: number) => {
    dispatch({
      type: ActionSetProduct.SETCATEGORY,
      payload: { category: id },
    });
  };

  const handleChange = (event: SelectChangeEvent) => {
    const category = categories.find((c: any) => c.id == event.target.value);
    setCategoryId(category.id);
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
            value={`${state?.category || ""}`}
            label="Category"
            onChange={handleChange}
          >
            {categories?.map((category: ICategoryLocalized) => {
              return (
                <MenuItem key={category.id} value={category.id}>
                  {category.title}
                </MenuItem>
              );
            })}
            {/* <MenuItem value={"0"}>Men</MenuItem>
            <MenuItem value={"1"}>Women</MenuItem>
            <MenuItem value={"2"}>Kids</MenuItem> */}
          </Select>
        </FormControl>
      </Box>
    </EditorCard>
  );
};
export default ProductCategorySelect;
