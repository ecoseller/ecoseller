import { IBillingInfo, IShippingInfo } from "@/types/cart/cart";

/**
 * Delete an item form the cart
 * @param cartToken
 * @param sku
 */
export const deleteItem = async (cartToken: string, sku: string) => {
  return fetch(`/api/cart/${cartToken}/${sku}`, {
    method: "DELETE",
  });
};

/**
 * update cart item's quantity
 * @param token
 * @param sku
 * @param quantity
 */
export const updateItemQuantity = async (
  token: string,
  sku: string,
  quantity: number
) => {
  return fetch(`/api/cart/${token}/item/`, {
    method: "PUT",
    body: JSON.stringify({ sku, quantity }),
  }).then((res) => res.json());
};

/**
 * update cart's billing info
 * @param cartToken
 * @param billingInfo
 */
export const updateBillingInfo = async (
  cartToken: string,
  billingInfo: IBillingInfo
) => {
  return fetch(`/api/cart/${cartToken}/billing-info/`, {
    method: "PUT",
    body: JSON.stringify(billingInfo),
  }).then((res) => res.json());
};

/**
 * update cart's shipping info
 * @param cartToken
 * @param shippingInfo
 */
export const updateShippingInfo = async (
  cartToken: string,
  shippingInfo: IShippingInfo
) => {
  return fetch(`/api/cart/${cartToken}/shipping-info/`, {
    method: "PUT",
    body: JSON.stringify(shippingInfo),
  }).then((res) => res.json());
};
