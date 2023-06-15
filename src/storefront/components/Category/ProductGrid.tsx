import { IProductRecord } from "@/types/product";
import React from "react";
import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";

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
      {products.map((p) => (
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <ProductCard product={p} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;
