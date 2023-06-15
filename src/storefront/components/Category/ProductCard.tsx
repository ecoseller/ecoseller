import { IProductRecord } from "@/types/product";
import Card from "@mui/material/Card";
import NextLink from "next/link";
import { CardActions, CardContent, CardMedia } from "@mui/material";
import imgPath from "@/utils/imgPath";
import Typography from "@mui/material/Typography";
import React from "react";

interface IProductCardProps {
  product: IProductRecord;
}

/**
 * Component displaying product card (contains its image, title, price, ...)
 * @param product
 * @constructor
 */
const ProductCard = ({ product }: IProductCardProps) => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <NextLink
        href={`/product/${product.id}/${product.slug}`}
        style={{ height: "100%" }}
      >
        <CardMedia
          sx={{ height: 140 }}
          image={imgPath(product.primary_image.media)}
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {product.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.meta_description}
          </Typography>
        </CardContent>
      </NextLink>
      <CardActions sx={{ mt: "auto" }}>
        <Typography gutterBottom variant="h6" component="div">
          {product.has_multiple_prices ? <span>From </span> : null}{" "}
          {product.price}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
