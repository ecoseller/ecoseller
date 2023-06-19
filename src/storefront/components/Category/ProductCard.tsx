import { IProductRecord } from "@/types/product";
import Card from "@mui/material/Card";
import NextLink from "next/link";
import { CardActions, CardContent, CardMedia } from "@mui/material";
import imgPath from "@/utils/imgPath";
import Typography from "@mui/material/Typography";
import React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { is } from "immutable";
import { number } from "prop-types";
import DiscountText from "@/components/Generic/DiscountText";

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

  // sort variant prices from cheapest to the most expensive
  product.variant_prices.sort((p1, p2) => p1.incl_vat - p2.incl_vat);

  const variantCount = product.variant_prices.length;
  const cheapestVariantPrice = product.variant_prices[0];

  const hasMultiplePrices =
    cheapestVariantPrice.incl_vat !=
    product.variant_prices[variantCount - 1].incl_vat;

  const discounts = product.variant_prices.map((p) => p.discount || 0);

  discounts.sort((d1, d2) => d2 - d1);

  const renderDiscountIfAny = () => {
    const maxDiscount = discounts[0];
    const minDiscount = discounts[discounts.length - 1];

    return (
      <>
        {maxDiscount > 0 ? (
          <DiscountText
            discount={maxDiscount}
            includeUpTo={minDiscount != maxDiscount}
          />
        ) : null}
      </>
    );
  };

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
          {variantCount > 1 ? (
            <Typography variant="body2" color="text.secondary">
              ({variantCount} variants)
            </Typography>
          ) : null}
          <Typography variant="body2" color="text.secondary">
            {product.meta_description}
          </Typography>
        </CardContent>
      </NextLink>
      <CardActions sx={{ mt: "auto", ml: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {hasMultiplePrices ? <span>From&nbsp;&nbsp;</span> : null}
          {cheapestVariantPrice.incl_vat_formatted}
          &nbsp;
          {renderDiscountIfAny()}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
