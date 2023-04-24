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
import { IPageCategoryType } from "@/types/cms";

interface IPageCategoryTypeSetterProps {
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

const PageCategoryTypeSetter = ({
  state,
  set,
}: IPageCategoryTypeSetterProps) => {
  const { data, error } = useSWR<IPageCategoryType[]>(`/cms/category/type/`);

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
        <InputLabel id="categories-checkbox-label">Types</InputLabel>
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
              (type) => selected.indexOf(type.id) > -1
            );
            return selectedCategories
              ?.map((type) => type.identifier)
              .join(", ");
          }}
          MenuProps={MenuProps}
        >
          {data?.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              <Checkbox checked={state.indexOf(type.id) > -1} />
              <ListItemText primary={type.identifier} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default PageCategoryTypeSetter;
