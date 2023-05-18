import { ICart, ICartToken } from "@/types/cart";

export const getCart = async (token: string) => {
  // Get cart by token
  // URL: /api/cart/{token}/
  // Method: GET
  // Params: token
  // Return: Promise
  return fetch(`/api/cart/${token}/`)
    .then((res) => res.json())
    .then((data) => data as ICart);
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
  return fetch(`/api/cart/`, {
    method: "POST",
    body: JSON.stringify({
      sku: sku,
      quantity: qunatity,
      product: product,
      pricelist: pricelist,
      country: country,
    }),
  })
    .then((res) => res.json())
    .then((data) => data as ICartToken);
};
