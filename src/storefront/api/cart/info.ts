import { IBillingInfo, IShippingInfo } from "@/types/cart";

export const putShippingInfo = async (
  token: string,
  shippingInfo: IShippingInfo
) => {
  const response = await fetch(`/api/cart/${token}/shipping-info/`, {
    method: "PUT",
    body: JSON.stringify(shippingInfo),
  });

  return await response.status;
};

export const putBillingInfo = async (
  token: string,
  billingInfo: IBillingInfo
) => {
  const response = await fetch(`/api/cart/${token}/billing-info/`, {
    method: "PUT",
    body: JSON.stringify(billingInfo),
  });

  return await response.status;
};
