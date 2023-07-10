// utils
import { useTranslation } from "next-i18next";

import { useCart } from "@/utils/context/cart";
import Typography from "@mui/material/Typography";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { ICart, ICartItem } from "@/types/cart";
import { Grid, Table, TableBody, TableCell, TableRow } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";
import imgPath from "@/utils/imgPath";
import TableHead from "@mui/material/TableHead";
import ImageThumbnail from "@/components/Generic/ImageThumbnail";
import NextLink from "next/link";
import MUILink from "@mui/material/Link";
import DiscountText from "@/components/Generic/DiscountText";
import OrderItemClaimModal from "@/components/Order/OrderItemClaimModal";
import { OrderItemClaimType } from "@/types/order";

interface ICartItemListProps {
  editable: boolean;
  cart: ICart;
  showClaimsColumn: boolean;
  orderId?: string;
}

/**
 * Component displaying list of items in the cart.
 *
 * Each row represents an item in a cart
 * @param cart
 * @param editable
 * @param showClaimsColumn
 * @param orderId
 * @constructor
 */
const CartItemList = ({
  cart,
  editable,
  showClaimsColumn,
  orderId = undefined,
}: ICartItemListProps) => {
  const { updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const { t } = useTranslation("cart");

  const updateItemQuantity = (item: ICartItem, addingOne: boolean = true) => {
    if (!addingOne && item.quantity == 1) {
      return;
    }

    const diff = addingOne ? 1 : -1;
    updateQuantity(item.product_variant_sku, item.quantity + diff);
  };

  return cart && cart.cart_items.length > 0 ? (
    <>
      <Table sx={{ minWidth: 650 }}>
        {editable ? null : (
          <TableHead>
            <TableCell align="center">{t("product")}</TableCell>
            <TableCell align="center">{t("image")}</TableCell>
            <TableCell align="center">{t("quantity")}</TableCell>
            <TableCell align="center">{t("discount")}</TableCell>
            <TableCell align="center">{t("total-price")}</TableCell>
            {showClaimsColumn && orderId ? (
              <>
                <TableCell align="center" />
                <TableCell align="center" />
              </>
            ) : null}
          </TableHead>
        )}
        <TableBody>
          {cart.cart_items.map((item) => (
            <TableRow key={item.product_variant_sku}>
              <TableCell align="center">
                <NextLink
                  href={`/product/${item.product_id}/${item.product_slug}`}
                >
                  <MUILink underline="none">
                    {item.product_variant_name}
                  </MUILink>
                </NextLink>
              </TableCell>

              <TableCell align="center">
                {item.primary_image ? (
                  <ImageThumbnail
                    imagePath={imgPath(item.primary_image.media, true)}
                    alt={item.primary_image.alt || ""}
                  />
                ) : null}
              </TableCell>

              <TableCell align="center">
                {editable ? (
                  <IconButton
                    onClick={() => {
                      updateItemQuantity(item, false);
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                ) : null}

                {item.quantity}

                {editable ? (
                  <IconButton
                    onClick={() => {
                      updateItemQuantity(item, true);
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                ) : null}
              </TableCell>

              <TableCell align="center" sx={{ fontWeight: 700 }}>
                {item.discount ? (
                  <DiscountText discount={item.discount} />
                ) : null}
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }} align="center">
                {item.total_price_incl_vat_formatted}
              </TableCell>

              {editable ? (
                <TableCell align="center">
                  <IconButton
                    onClick={() => {
                      removeFromCart(item.product_variant_sku);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              ) : null}
              {showClaimsColumn && orderId ? (
                <>
                  <TableCell align="center">
                    <OrderItemClaimModal
                      orderId={orderId}
                      cartItemId={item.id}
                      claimType={OrderItemClaimType.WARRANTY_CLAIM}
                      openModalLinkText="Warranty claim"
                      cartItemName={item.product_variant_name}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <OrderItemClaimModal
                      orderId={orderId}
                      cartItemId={item.id}
                      claimType={OrderItemClaimType.RETURN}
                      openModalLinkText="Return"
                      cartItemName={item.product_variant_name}
                    />
                  </TableCell>
                </>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editable ? (
        <Grid container justifyContent="center" sx={{ my: 3 }}>
          <Grid item>
            <Typography variant="h6">
              {
                t("total-price-incl-price", {
                  price: cart.total_price_incl_vat_formatted,
                }) /**Total price:&nbsp; */
              }
            </Typography>
          </Grid>
        </Grid>
      ) : null}
    </>
  ) : (
    <Typography variant="h6" sx={{ my: 3 }}>
      {t("no-items")}
    </Typography>
  );
};

export default CartItemList;
