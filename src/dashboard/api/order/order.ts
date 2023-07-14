import {
  IOrderDetail,
  OrderStatus,
  OrderItemComplaintStatus,
} from "@/types/order";

/**
 * Get order by its token
 * @param token
 */
export const getOrder = async (token: string) => {
  return fetch(`/api/order/${token}`)
    .then((res) => res.json())
    .then((data) => data as IOrderDetail);
};

export const updateOrderStatus = async (
  token: string,
  newStatus: OrderStatus
) => {
  return fetch(`/api/order/${token}`, {
    method: "PUT",
    body: JSON.stringify({ status: newStatus }),
  });
};

export const updateOrderItemComplaintStatus = async (
  complaintId: number,
  newStatus: OrderItemComplaintStatus
) => {
  return fetch(`/api/order/complaint/${complaintId}`, {
    method: "PUT",
    body: JSON.stringify({ status: newStatus }),
  });
};
