import { IOrderItemComplaintCreate } from "@/types/order";

export const createOrderItemComplaint = async (
  claim: IOrderItemComplaintCreate
) => {
  return fetch(`/api/order/complaint/`, {
    method: "POST",
    body: JSON.stringify(claim),
  });
};
