// next.js
// react
import React, { useEffect, useState } from "react";
import { usePermission } from "@/utils/context/permission";

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
import { flattenCategory } from "@/utils/category";

interface ICategorySelectProps {
  categoryId: number | null | undefined;
  setCategoryId: (categoryId: number | null) => void;
  title?: string;
}

const CategorySelectForm = ({
  categoryId,
  setCategoryId,
  title = "Category",
}: ICategorySelectProps) => {
  const [categories, setCategories] = useState<ICategoryLocalized[]>([]);
  const { hasPermission } = usePermission();
  // load categories from API
  useEffect(() => {
    getAllCategories().then((categories) => {
      const rows = categories.flatMap((category) => {
        return flattenCategory(category);
      });
      setCategories(rows);
    });
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    const menuItemValue = event.target.value;

    if (menuItemValue === "") {
      setCategoryId(null);
    } else {
      const category = categories.find(
        (c) => c.id.toString() === event.target.value
      );

      if (category !== undefined) {
        console.log(category.id);
        setCategoryId(category.id);
      }
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
            disabled={!hasPermission}
            label="Category"
            onChange={handleChange}
          >
            <MenuItem key={null} value={""}>
              None
            </MenuItem>
            {categories?.map((category: ICategoryLocalized) => {
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
