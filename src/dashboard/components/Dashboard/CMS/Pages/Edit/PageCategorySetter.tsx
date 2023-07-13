// next

// react

// libs
import useSWR from "swr";

// mui
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
// types
import { IPageCategory } from "@/types/cms";

interface IPageCategorySetterProps {
  state: number[];
  set: (catIds: number[]) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const PageCategorySetter = ({ state, set }: IPageCategorySetterProps) => {
  const { data, error } = useSWR<IPageCategory[]>(`/api/cms/category`);

  const handleChange = (event: SelectChangeEvent<typeof state>) => {
    const {
      target: { value },
    } = event;
    console.log("value", value);
    set(value as number[]);
  };

  console.log("data", data);
  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="categories-checkbox-label">Categories</InputLabel>
        <Select
          labelId="categories-checkbox-label"
          id="categories-checkbox"
          multiple
          value={state}
          onChange={handleChange}
          input={<OutlinedInput label="Categories" />}
          //   renderValue={(selected) => selected.join(", ")}
          renderValue={(selected) => {
            const selectedCategories = data?.filter(
              (category) => selected.indexOf(category.id) > -1
            );
            return selectedCategories
              ?.map((category) => category.translations?.en?.title)
              .join(", ");
          }}
          MenuProps={MenuProps}
        >
          {data?.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              <Checkbox checked={state.indexOf(category.id) > -1} />
              <ListItemText primary={category.translations?.en?.title} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default PageCategorySetter;
