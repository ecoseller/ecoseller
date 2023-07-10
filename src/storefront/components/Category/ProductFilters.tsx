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
import NumericFilterSelect from "@/components/Category/Filters/NumericFilterSelect";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";
import { useTranslation } from "next-i18next";

interface IProductFiltersProps {
  filters: IFilters;
  updateTextualFilter: (id: number, selectedValuesIds: number[]) => void;
  updateNumericFilter: (
    id: number,
    numericFilterValueType: NumericFilterValueType,
    valueId: number | null
  ) => void;
  setEmptyFilters: () => void;
}

/**
 * Component displaying product filters
 * @constructor
 */
const ProductFilters = ({
  filters,
  updateTextualFilter,
  updateNumericFilter,
  setEmptyFilters,
}: IProductFiltersProps) => {
  const { t } = useTranslation(["category", "common"]);

  const handleTextualFilterChange = (
    id: number,
    event: SelectChangeEvent<number[]>
  ) => {
    const value = event.target.value;
    const selectedValuesIds =
      typeof value === "string"
        ? value.split(",").map((v) => Number(v))
        : value;
    updateTextualFilter(id, selectedValuesIds);
  };

  const handleNumericFilterChange = (
    id: number,
    numericFilterValueType: NumericFilterValueType,
    event: SelectChangeEvent<string | null>
  ) => {
    const valueId = event.target.value;
    updateNumericFilter(
      id,
      numericFilterValueType,
      valueId ? Number(valueId) || null : null
    );
  };

  return (
    <CollapsableContentWithTitle title={t("filters")} defaultOpen={true}>
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
                  value={filter.selected_values_ids}
                  onChange={(event) =>
                    handleTextualFilterChange(filter.id, event)
                  }
                  input={<OutlinedInput label={filter.name} />}
                  renderValue={(selected_values_ids) =>
                    selected_values_ids
                      .map(
                        (id) =>
                          filter.possible_values.find((v) => v.id == id)?.value
                      )
                      .join(", ")
                  }
                >
                  {filter.possible_values.map((val) => (
                    <MenuItem key={val.id} value={val.id}>
                      <Checkbox
                        checked={
                          filter.selected_values_ids.indexOf(val.id) > -1
                        }
                      />
                      <ListItemText
                        primary={`${val.value} ${filter.unit || ""}`}
                      />
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
          return (
            <Grid item xs={6} sm={4} md={3} lg={2} key={id}>
              <FormControl sx={{ m: 1 }}>
                <Typography variant="body1">{filter.name}</Typography>
                <div>
                  <NumericFilterSelect
                    filter={filter}
                    label={t("from", { ns: "common" })}
                    selectedValueId={filter.min_value_id}
                    handleChange={(event) =>
                      handleNumericFilterChange(
                        filter.id,
                        NumericFilterValueType.Min,
                        event
                      )
                    }
                  />
                  <NumericFilterSelect
                    filter={filter}
                    label={t("to", { ns: "common" })}
                    selectedValueId={filter.max_value_id}
                    handleChange={(event) =>
                      handleNumericFilterChange(
                        filter.id,
                        NumericFilterValueType.Max,
                        event
                      )
                    }
                  />
                </div>
              </FormControl>
            </Grid>
          );
        })}
      </Grid>
      <Button
        size="small"
        startIcon={<CancelIcon />}
        onClick={() => setEmptyFilters()}
      >
        {t("cancel-filters")}
      </Button>
    </CollapsableContentWithTitle>
  );
};

export default ProductFilters;
