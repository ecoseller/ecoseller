// next.js
// react
import React, { useEffect, useState } from "react";
// components
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
// mui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ICategoryLocalized } from "@/types/category";
import { getAllCategories } from "@/api/category/category";

interface ICategorySelectProps
{
  categoryId: number | null | undefined;
  setCategoryId: (categoryId: number) => void;
  title?: string;
}

const CategorySelectForm = ({
                              categoryId,
                              setCategoryId,
                              title = "Category"
                            }: ICategorySelectProps) =>
{

  const [categories, setCategories] = useState<ICategoryLocalized[]>([]);

  // load categories from API
  useEffect(() =>
  {
    getAllCategories().then((categories) =>
    {
      setCategories(categories.data);
    });
  }, []);

  // const setCategory = (id: number) => {
  //   dispatch({
  //     type: ActionSetProduct.SETCATEGORY,
  //     payload: { category: id },
  //   });
  // };

  const handleChange = (event: SelectChangeEvent) =>
  {
    const category = categories.find((c) => c.id.toString() === event.target.value);

    if (category !== undefined)
    {
      console.log(category.id)
      setCategoryId(category.id);
    }
  };

  return (
    <EditorCard>
      <Typography variant="h6">{title}</Typography>
      <Box mt={2}>
        <FormControl fullWidth>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={`${categoryId || ""}`}
            label="Category"
            onChange={handleChange}
          >
            {categories?.map((category: ICategoryLocalized) =>
            {
              return (
                <MenuItem key={category.id} value={category.id.toString()}>
                  {category.title}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
    </EditorCard>
  );
};
export default CategorySelectForm;
