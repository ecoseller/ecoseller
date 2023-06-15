import { IProductRecord } from "@/types/product";
import Card from "@mui/material/Card";
import NextLink from "next/link";
import { CardActions, CardContent, CardMedia } from "@mui/material";
import imgPath from "@/utils/imgPath";
import Typography from "@mui/material/Typography";
import React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface IProductCardProps {
  product: IProductRecord;
}

/**
 * Component displaying product card (contains its image, title, price, ...)
 * @param product
 * @constructor
 */
const ProductCard = ({ product }: IProductCardProps) => {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "xl"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const imgHeight = isSmallScreen
    ? "100px"
    : isMediumScreen
    ? "150px"
    : "200px";

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <NextLink
        href={`/product/${product.id}/${product.slug}`}
        style={{ height: "100%" }}
      >
        <CardMedia
          component="img"
          height={imgHeight}
          sx={{
            objectFit: "contain",
          }}
          image={imgPath(product.primary_image.media)}
          title={product.primary_image.alt || ""}
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
          {product.has_multiple_prices ? <span>From&nbsp;&nbsp;</span> : null}
          {product.price}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
