import { ICartData, ICartItem } from "@/types/cart";

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

export interface IOrderItem extends ICartItem {
  complaints: IOrderItemComplaint[];
}

export interface IOrderCart extends ICartData {
  cart_items: IOrderItem[];
}

interface IOrderDetail {
  token: string;
  cart: IOrderCart;
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

enum OrderItemComplaintStatus {
  CREATED = "CREATED",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
}

export enum OrderItemComplaintType {
  RETURN = "RETURN",
  WARRANTY_CLAIM = "WARRANTY_CLAIM",
}

export interface IOrderItemComplaintCreate {
  cart_item: number;
  order: string;
  description: string;
  type: OrderItemComplaintType;
}

export interface IOrderItemComplaint {
  id: number;
  status: OrderItemComplaintStatus;
  type: OrderItemComplaintType;
  description: string;
  create_at: string;
}
