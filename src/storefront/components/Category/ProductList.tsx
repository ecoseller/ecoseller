import { IProductRecord } from "@/types/product";
import ImageThumbnail from "@/components/Generic/ImageThumbnail";
import imgPath from "@/utils/imgPath";
import React from "react";
import { CardContent, CardMedia, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

interface IProductListProps {
  products: IProductRecord[];
}

const ProductList = ({ products }: IProductListProps) => {
  return (
    <Grid container spacing={{ xs: 1, sm: 2 }}>
      {products.map((p) => (
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <Card>
            <NextLink href={`/product/${p.id}/${p.slug}`}>
              <CardMedia
                sx={{ height: 140 }}
                image={imgPath(p.primary_image.media)}
                title="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {p.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {p.meta_description}
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                  {p.has_multiple_prices ? <span>From </span> : null} {p.price}
                </Typography>
              </CardContent>
            </NextLink>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
