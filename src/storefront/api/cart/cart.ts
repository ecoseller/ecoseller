export const getCart = async (token: string) => {
  // Get cart by token
  // URL: /api/cart/{token}/
  // Method: GET
  // Params: token
  // Return: Promise
  return await fetch(`/api/cart/${token}/`);
};

export const createCart = async (
  sku: string,
  qunatity: number,
  product: number,
  pricelist: string,
  country: string
) => {
  // Create cart
  // URL: /api/cart/
  // Method: POST
  // Params: none
  // Return: Promise
  return await fetch(`/api/cart/`, {
    method: "POST",
    body: JSON.stringify({
      sku: sku,
      quantity: qunatity,
      product: product,
      pricelist: pricelist,
      country: country,
    }),
  });
};
