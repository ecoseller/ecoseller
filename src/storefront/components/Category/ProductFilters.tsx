import { ICategoryBase } from "@/types/category";
import { useRouter } from "next/router";
import React from "react";
import { Grid } from "@mui/material";
import PaperItem from "@/components/Generic/PaperItem";
import CollapsableContentWithTitle from "@/components/Generic/CollapsableContentWithTitle";
import NextLink from "next/link";
import MUILink from "@mui/material/Link";

/**
 * Component displaying product filters and ordering
 * @constructor
 */
const ProductFilters = () => {
  const router = useRouter();

  return (
    <CollapsableContentWithTitle title="Filters" defaultOpen={true}>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        <Grid item>Not implemented yet...</Grid>
      </Grid>
    </CollapsableContentWithTitle>
  );
};

export default ProductFilters;
