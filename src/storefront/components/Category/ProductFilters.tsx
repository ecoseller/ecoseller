import { useRouter } from "next/router";
import React from "react";
import {
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import CollapsableContentWithTitle from "@/components/Generic/CollapsableContentWithTitle";
import ProductCard from "@/components/Category/ProductCard";
import MenuItem from "@mui/material/MenuItem";
import { IFilters } from "@/pages/category/[id]/[slug]";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";

interface IProductFiltersProps {
  filters: IFilters;
  updateFilter: (id: number, selectedValues: string[]) => void;
}

/**
 * Component displaying product filters
 * @constructor
 */
const ProductFilters = ({ filters, updateFilter }: IProductFiltersProps) => {
  const router = useRouter();

  const handleChange = (id: number, event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const selectedValues = typeof value === "string" ? value.split(",") : value;
    updateFilter(id, selectedValues);
  };

  return (
    <CollapsableContentWithTitle title="Filters" defaultOpen={true}>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        {Object.entries(filters.textual).map(([id, filter]) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={id}>
            <FormControl sx={{ m: 1, width: "100%" }}>
              <InputLabel id="filter-checkbox">{filter.name}</InputLabel>
              <Select
                labelId="filter-checkbox"
                id="demo-multiple-checkbox"
                multiple
                value={filter.selectedValues}
                onChange={(event) => handleChange(filter.id, event)}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(", ")}
                // MenuProps={MenuProps}
              >
                {filter.possible_values.map((val) => (
                  <MenuItem key={val} value={val}>
                    <Checkbox
                      checked={filter.selectedValues.indexOf(val) > -1}
                    />
                    <ListItemText primary={`${val} ${filter.unit || ""}`} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}
        {/*{filters.numeric.map((x) => (*/}
        {/*  <Grid item xs={6} sm={4} md={3} lg={2} key={x.id}>*/}
        {/*    {x.name}*/}
        {/*  </Grid>*/}
        {/*))}*/}
      </Grid>
    </CollapsableContentWithTitle>
  );
};

export default ProductFilters;
