import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { ICart, ICartItem } from "@/types/cart";
import { Grid, Table, TableBody, TableCell, TableRow } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import imgPath from "@/utils/imgPath";
import { IOrderDetail } from "@/types/order";
import CollapsableContentWithTitle from "../../Generic/CollapsableContentWithTitle";
import EditorCard from "../../Generic/EditorCard";

interface IOrderDetailItemListProps {
  cart: ICart;
}

const OrderDetailItemList = ({ cart }: IOrderDetailItemListProps) => {
  const router = useRouter();

  const updateItemQuantity = (item: ICartItem, addingOne: boolean = true) => {
    if (!addingOne && item.quantity == 1) {
      return;
    }

    const diff = addingOne ? 1 : -1;
    // updateQuantity(item.product_variant_sku, item.quantity + diff);
  };

  return (
    <EditorCard>
      <CollapsableContentWithTitle title="Order items">
        <Table sx={{ minWidth: 650 }}>
          <TableBody>
            {cart.cart_items.map((item) => (
              <TableRow key={item.product_variant_sku}>
                <TableCell align="center">
                  <Button
                    onClick={() =>
                      router.push(
                        `/dashboard/catalog/products/edit/${item.product_id}/`
                      )
                    }
                  >
                    {item.product_variant_name}
                  </Button>
                </TableCell>

                {item.primary_image ? (
                  <TableCell>
                    <img
                      src={imgPath(item.primary_image.media)}
                      alt={item.primary_image.alt || ""}
                      style={{
                        objectFit: "contain",
                        position: "relative",
                        height: "50px",
                        width: "auto",
                      }}
                    />
                  </TableCell>
                ) : null}

                <TableCell align="center">
                  <IconButton
                    onClick={() => {
                      updateItemQuantity(item, false);
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  {item.quantity}
                  <IconButton
                    onClick={() => {
                      updateItemQuantity(item, true);
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </TableCell>

                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  {item.discount ? (
                    <span className="red-text">-{item.discount} %</span>
                  ) : null}
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }} align="center">
                  {item.total_price_net_formatted}
                </TableCell>

                <TableCell align="center">
                  <IconButton
                    onClick={() => {
                      // removeFromCart(item.product_variant_sku);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Grid container justifyContent="center" sx={{ my: 3 }}>
          <Grid item>
            <Typography variant="h6">
              Total price:&nbsp;{cart.total_price_net_formatted}
            </Typography>
          </Grid>
        </Grid>
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};

export default OrderDetailItemList;
