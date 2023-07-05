import { IProductRecord } from "@/types/product";
import React from "react";
import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";
import Typography from "@mui/material/Typography";

interface IProductListProps {
  products: IProductRecord[];
}

/**
 * Component displaying grid of products and its image, title, price, ...
 * @param products
 * @constructor
 */
const ProductGrid = ({ products }: IProductListProps) => {
  return (
    <Grid container spacing={{ xs: 1, sm: 2 }}>
      {products?.length > 0 ? (
        products.map((p) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={p.id}>
            <ProductCard product={p} />
          </Grid>
        ))
      ) : (
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Typography variant="h6">No products</Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default ProductGrid;
