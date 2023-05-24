export const setShippingMethod = async (token: string, id: number) => {
  const url = `/api/cart/${token}/shipping-method/${id}`;
  return await fetch(url, {
    method: "PUT",
  }).then((res) => res.status);
};

export const setPaymentMethod = async (token: string, id: number) => {
  const url = `/api/cart/${token}/payment-method/${id}`;
  return await fetch(url, {
    method: "PUT",
  }).then((res) => res.status);
};
