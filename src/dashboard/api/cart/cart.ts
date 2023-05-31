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
