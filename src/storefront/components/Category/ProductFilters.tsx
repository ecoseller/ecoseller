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
import MenuItem from "@mui/material/MenuItem";
import { IFilters, NumericFilterValueType } from "@/pages/category/[id]/[slug]";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

interface IProductFiltersProps {
  filters: IFilters;
  updateTextualFilter: (id: number, selectedValues: string[]) => void;
  updateNumericFilter: (
    id: number,
    numericFilterValueType: NumericFilterValueType,
    value: number | null
  ) => void;
}

/**
 * Component displaying product filters
 * @constructor
 */
const ProductFilters = ({
  filters,
  updateTextualFilter,
  updateNumericFilter,
}: IProductFiltersProps) => {
  const handleTextualFilterChange = (
    id: number,
    event: SelectChangeEvent<string[]>
  ) => {
    const value = event.target.value;
    const selectedValues = typeof value === "string" ? value.split(",") : value;
    updateTextualFilter(id, selectedValues);
  };

  const handleNumericFilterChange = (
    id: number,
    numericFilterValueType: NumericFilterValueType,
    event: SelectChangeEvent<string | null>
  ) => {
    const value = event.target.value;
    updateNumericFilter(
      id,
      numericFilterValueType,
      value ? Number(value) || null : null
    );
  };

  return (
    <CollapsableContentWithTitle title="Filters" defaultOpen={true}>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        {Object.entries(filters.textual).map(([id, filter]) => {
          const selectId = `filter-select-${id}`;

          return (
            <Grid item xs={6} sm={4} md={3} lg={2} key={id}>
              <FormControl sx={{ m: 1, width: "100%" }}>
                <InputLabel id={`${selectId}-label`}>{filter.name}</InputLabel>
                <Select
                  labelId={`${selectId}-label`}
                  id={selectId}
                  multiple
                  value={filter.selected_values}
                  onChange={(event) =>
                    handleTextualFilterChange(filter.id, event)
                  }
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {filter.possible_values.map((val) => (
                    <MenuItem key={val} value={val}>
                      <Checkbox
                        checked={filter.selected_values.indexOf(val) > -1}
                      />
                      <ListItemText primary={`${val} ${filter.unit || ""}`} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          );
        })}
      </Grid>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        {Object.entries(filters.numeric).map(([id, filter]) => {
          const selectId = `filter-select-${id}`;

          return (
            <Grid item xs={6} sm={4} md={3} lg={2} key={id}>
              <FormControl sx={{ m: 1 }}>
                <Typography variant="body1">{filter.name}</Typography>
                <div>
                  <FormControl sx={{ m: 1, minWidth: 100 }}>
                    <InputLabel id={`${selectId}-from-label`}>From</InputLabel>
                    <Select
                      id={`${selectId}-from`}
                      label="From"
                      labelId={`${selectId}-from-label`}
                      value={filter.min_value?.toString() || null}
                      defaultValue=""
                      onChange={(event) =>
                        handleNumericFilterChange(
                          filter.id,
                          NumericFilterValueType.Min,
                          event
                        )
                      }
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {filter.possible_values.map((val) => (
                        <MenuItem key={val} value={val}>
                          {val} {filter.unit || ""}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 100 }}>
                    <InputLabel id={`${selectId}-to-label`}>To</InputLabel>
                    <Select
                      id={`${selectId}-to`}
                      label="To"
                      labelId={`${selectId}-to-label`}
                      value={filter.max_value?.toString() || null}
                      defaultValue=""
                      onChange={(event) =>
                        handleNumericFilterChange(
                          filter.id,
                          NumericFilterValueType.Max,
                          event
                        )
                      }
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {filter.possible_values.map((val) => (
                        <MenuItem key={val} value={val}>
                          {val} {filter.unit || ""}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </FormControl>
            </Grid>
          );
        })}
      </Grid>
    </CollapsableContentWithTitle>
  );
};

export default ProductFilters;
