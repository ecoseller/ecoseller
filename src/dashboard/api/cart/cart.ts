/**
 * Delete an item form the cart
 * @param cartToken
 * @param sku
 */
export const deleteItem = async (cartToken: string, sku: string) => {
  return fetch(`/api/cart/${cartToken}/${sku}`, {
    method: "DELETE",
  }).then((res) => res.json());
};
