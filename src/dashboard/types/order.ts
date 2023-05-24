import { ICart } from "@/types/cart";

export enum OrderStatus {
  Pending = "PENDING",
  Processing = "PROCESSING",
  Shipped = "SHIPPED",
  Cancelled = "CANCELLED",
}

interface IOrderBase {
  token: string;
  create_at: string;
  status: OrderStatus;
}

export interface IOrder extends IOrderBase {
  customer_email: string;
}

export interface IOrderDetail extends IOrderBase {
  cart: ICart;
}
