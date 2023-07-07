import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { INumericAttributeFilterWithOptions } from "@/pages/category/[id]/[slug]";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import { useTranslation } from "next-i18next";

interface INumericFilterSelectProps {
  filter: INumericAttributeFilterWithOptions;
  selectedValueId: number | null;
  label: string;
  handleChange: (event: SelectChangeEvent<string | null>) => void;
}

const NumericFilterSelect = ({
  filter,
  selectedValueId,
  label,
  handleChange,
}: INumericFilterSelectProps) => {
  const { t } = useTranslation("category");
  const selectId = `filter-select-${filter.id}`;

  return (
    <FormControl sx={{ m: 1, minWidth: 100 }}>
      <InputLabel id={`${selectId}-label`}>{label}</InputLabel>
      <Select
        id={selectId}
        label={label}
        labelId={`${selectId}-label`}
        value={selectedValueId?.toString() || ""}
        defaultValue=""
        onChange={(event) => handleChange(event)}
      >
        <MenuItem value="">
          <em>{t("filter-empty")}</em>
        </MenuItem>
        {filter.possible_values.map((val) => (
          <MenuItem key={val.id} value={val.id}>
            {val.value} {filter.unit || ""}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default NumericFilterSelect;
