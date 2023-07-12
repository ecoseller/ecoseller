// utils
import { useTranslation } from "next-i18next";

import { useCart } from "@/utils/context/cart";
import Typography from "@mui/material/Typography";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { ICart, ICartItem } from "@/types/cart";
import {
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import imgPath from "@/utils/imgPath";
import TableHead from "@mui/material/TableHead";
import ImageThumbnail from "@/components/Generic/ImageThumbnail";
import NextLink from "next/link";
import MUILink from "@mui/material/Link";
import DiscountText from "@/components/Generic/DiscountText";
import OrderItemClaimModal from "@/components/Order/OrderItemClaimModal";
import { IOrderCart, IOrderItem, OrderItemComplaintType } from "@/types/order";

function isOrderCart(cart: ICart | IOrderCart): boolean {
  return "complaints" in cart.cart_items[0];
}

interface ICartItemListProps {
  editable: boolean;
  cart: ICart | IOrderCart;
  orderId?: string;
}

/**
 * Component displaying list of items in the cart.
 *
 * Each row represents an item in a cart
 * @param cart
 * @param editable
 * @param orderId
 * @constructor
 */
const CartItemList = ({
  cart,
  editable,
  orderId = undefined,
}: ICartItemListProps) => {
  const { updateQuantity, removeFromCart } = useCart();
  const showComplaintsColumn = isOrderCart(cart) && orderId != undefined;

  const { t } = useTranslation(["cart", "order"]);

  const updateItemQuantity = (item: ICartItem, addingOne: boolean = true) => {
    if (!addingOne && item.quantity == 1) {
      return;
    }

    const diff = addingOne ? 1 : -1;
    updateQuantity(item.product_variant_sku, item.quantity + diff);
  };

  const renderComplaintsColumn = (item: IOrderItem, orderId: string) => {
    if (item.complaints.length > 0) {
      const lastComplaint = item.complaints[item.complaints.length - 1];
      return (
        <TableCell align="center">
          {lastComplaint.type == OrderItemComplaintType.WARRANTY_CLAIM
            ? t("claimed-warranty", { ns: "order" })
            : t("returned", { ns: "order" })}
          , {t("status", { ns: "order" })}:&nbsp;
          {t(`status-${lastComplaint.status}`, { ns: "order" })}
        </TableCell>
      );
    } else {
      return (
        <>
          <TableCell align="center">
            <Stack direction="row" spacing={2}>
              <OrderItemClaimModal
                orderId={orderId}
                cartItemId={item.id}
                claimType={OrderItemComplaintType.WARRANTY_CLAIM}
                openModalLinkText={t("claim-warranty", { ns: "order" })}
                cartItemName={item.product_variant_name}
              />
              <OrderItemClaimModal
                orderId={orderId}
                cartItemId={item.id}
                claimType={OrderItemComplaintType.RETURN}
                openModalLinkText={t("return", { ns: "order" })}
                cartItemName={item.product_variant_name}
              />
            </Stack>
          </TableCell>
        </>
      );
    }
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
            {showComplaintsColumn ? <TableCell align="center" /> : null}
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
              {showComplaintsColumn
                ? renderComplaintsColumn(item as IOrderItem, orderId)
                : null}
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
                  price: cart.total_items_price_incl_vat_formatted,
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
