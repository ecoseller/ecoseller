import { IProductRecord } from "@/types/product";
import React from "react";
import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";

interface IProductListProps {
  products: IProductRecord[];
  loading?: boolean;
}

/**
 * Component displaying grid of products and its image, title, price, ...
 * @param products
 * @param loading
 * @constructor
 */
const ProductGrid = ({ products, loading }: IProductListProps) => {
  const { t } = useTranslation("category");

  if (loading) {
    return (
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <CircularProgress />
      </Grid>
    );
  }
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
          <Typography variant="h6">{t("no-products")}</Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default ProductGrid;
