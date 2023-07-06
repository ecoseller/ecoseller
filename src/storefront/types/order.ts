import { ICart } from "@/types/cart";

export enum OrderStatus {
  Pending = "PENDING",
  Processing = "PROCESSING",
  Shipped = "SHIPPED",
  Cancelled = "CANCELLED",
}

export interface IOrderBasicInfo {
  token: string;
  create_at: string;
  status: OrderStatus;
  items: string[];
}

interface IOrderDetail {
  token: string;
  cart: ICart;
  create_at: string;
  status: OrderStatus;
}

enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

interface IOrderPayment {
  status: PaymentStatus;
}

export interface IOrderWithPayment {
  order: IOrderDetail;
  payment: IOrderPayment | null;
}
