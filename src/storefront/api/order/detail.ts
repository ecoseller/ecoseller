export const orderDetailAPI = async (orderId: string) => {
  return await fetch(`/api/order/${orderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
