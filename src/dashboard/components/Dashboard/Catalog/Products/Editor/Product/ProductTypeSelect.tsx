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
import {
  ActionSetProduct,
  IProductType,
  ISetProductStateData,
} from "@/types/product";
import { ISetProductStateAction } from "../ProductEditorWrapper";
import Link from "next/link";
import { usePermission } from "@/utils/context/permission";

interface IProductMediaEditorProps {
  types: IProductType[] | undefined;
  state: ISetProductStateData;
  dispatch: React.Dispatch<ISetProductStateAction>;
  disabled?: boolean;
}

const ProductTypeSelect = ({
  types,
  state,
  dispatch,
  disabled,
}: IProductMediaEditorProps) => {
  // simple select with categories
  const { hasPermission } = usePermission();
  const setProductTypeId = (id: number | undefined) => {
    dispatch({
      type: ActionSetProduct.SETPRODUCTTYPEID,
      payload: { type_id: id },
    });
  };

  const setProductTypeObject = (type: IProductType) => {
    dispatch({
      type: ActionSetProduct.SETPRODUCTTYPE,
      payload: { type },
    });
  };

  const handleChange = (event: SelectChangeEvent) => {
    const selectedType = types?.find(
      (t: IProductType) => `${t.id}` == event.target.value
    );
    if (selectedType) {
      setProductTypeId(selectedType?.id || undefined);
      setProductTypeObject(selectedType);
    }
  };

  return (
    <EditorCard>
      <Typography variant="h6">Product type</Typography>
      <Box mt={2}>
        {disabled ? (
          <>
            <Link
              href={{
                pathname: "/dashboard/catalog/product-types/[id]",
                query: { id: state?.type?.id },
              }}
            >
              <Typography variant="body1">{state?.type?.name}</Typography>
            </Link>
            <Typography variant="body2" color="textSecondary">
              Product type cannot be changed after product is created.
            </Typography>
          </>
        ) : (
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Product type</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={`${state?.type_id || ""}`}
              label="Product type"
              disabled={!hasPermission}
              onChange={handleChange}
            >
              {types?.map((type: IProductType) => {
                return (
                  <MenuItem
                    key={type.id}
                    value={type.id}
                    disabled={!hasPermission}
                  >
                    {type.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      </Box>
    </EditorCard>
  );
};
export default ProductTypeSelect;
