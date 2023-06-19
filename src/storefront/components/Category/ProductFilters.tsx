import { useRouter } from "next/router";
import React from "react";
import { Grid } from "@mui/material";
import CollapsableContentWithTitle from "@/components/Generic/CollapsableContentWithTitle";

/**
 * Component displaying product filters and ordering
 * @constructor
 */
const ProductFilters = () => {
  const router = useRouter();

  return (
    <CollapsableContentWithTitle title="Filters" defaultOpen={true}>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        <Grid item xs={12}>
          Filters not implemented yet...
        </Grid>
      </Grid>
    </CollapsableContentWithTitle>
  );
};

export default ProductFilters;
