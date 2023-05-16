export const postCartProduct = async (
  token: string,
  sku: string,
  quantity: number
) => {
  // POST cart product to the backend
  // URL: /api/cart/{token}/product/
  // Method: POST
  // Params: token, sku, quantity
  // Return: Promise
  console.log("postCartProduct", token, sku, quantity);
  return await fetch(`/api/cart/${token}/product/`, {
    method: "POST",
    body: JSON.stringify({ sku, quantity }),
  });
};

export const putCartProduct = async (
  token: string,
  sku: string,
  quantity: number
) => {
  // PUT cart product to the backend
  // URL: /api/cart/{token}/product/
  // Method: PUT
  // Params: token, sku, quantity
  // Return: Promise
  return await fetch(`/api/cart/${token}/product/`, {
    method: "PUT",
    body: JSON.stringify({ sku, quantity }),
  });
};
