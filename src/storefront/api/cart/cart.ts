export const getCart = async (token: string) => {
  // Get cart by token
  // URL: /api/cart/{token}/
  // Method: GET
  // Params: token
  // Return: Promise
  return await fetch(`/api/cart/${token}/`);
};

export const createCart = async () => {
  // Create cart
  // URL: /api/cart/
  // Method: POST
  // Params: none
  // Return: Promise
  return await fetch(`/api/cart/`, {
    method: "POST",
  });
};
