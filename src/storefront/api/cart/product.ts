/**
 * POST cart product to the backend
 * URL: /api/cart/{token}/product/
 * Method: POST
 * Params: token, sku, quantity
 * Return: Promise
 * @param token
 * @param sku
 * @param quantity
 * @param product
 * @param pricelist
 * @param country
 */
export const postCartProduct = async (
  token: string,
  sku: string,
  quantity: number,
  product: number,
  pricelist: string,
  country: string
) => {
  console.log("postCartProduct", token, sku, quantity);
  return await fetch(`/api/cart/${token}/product/`, {
    method: "POST",
    body: JSON.stringify({ sku, quantity, product, pricelist, country }),
  });
};

/**
 * PUT cart product to the backend
 * URL: /api/cart/{token}/product/
 * Method: PUT
 * Params: token, sku, quantity
 * Return: Promise
 * @param token
 * @param sku
 * @param quantity
 */
export const putCartProduct = async (
  token: string,
  sku: string,
  quantity: number
) => {
  return fetch(`/api/cart/${token}/product/`, {
    method: "PUT",
    body: JSON.stringify({ sku, quantity }),
  }).then((res) => res.json());
};

/**
 * Delete a product variant from the cart
 * @param token cart token
 * @param sku sku of the product variant
 */
export const deleteCartProduct = async (token: string, sku: string) => {
  return fetch(`/api/cart/${token}/${sku}/`, {
    method: "DELETE",
  });
};
