import { IOrderDetail } from "@/types/order";

/**
 * Get order by its token
 * @param token
 */
export const getOrder = async (token: string) => {
  return fetch(`/api/order/${token}`)
    .then((res) => res.json())
    .then((data) => data as IOrderDetail);
};
