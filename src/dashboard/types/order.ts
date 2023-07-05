import { ICart } from "@/types/cart/cart";

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

export interface ISummaryValue {
  code: string;
  symbol: string;
  value: number;
}

export interface IOrderStats {
  orders_count: ISummaryValue[];
  revenue: ISummaryValue[];
  average_order_value: ISummaryValue[];
  average_items_per_order: ISummaryValue[];
  top_selling_products: any[];
  daily_orders_count: number[];
}
