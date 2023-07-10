import { IOrderItemClaimCreate } from "@/types/order";

export const claimOrderItem = async (claim: IOrderItemClaimCreate) => {
  return fetch(`/api/order/claim/`, {
    method: "POST",
    body: JSON.stringify(claim),
  });
};
