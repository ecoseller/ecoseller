import { ICart, ICartProductMedia } from "@/types/cart/cart";

export enum OrderStatus {
  Pending = "PENDING",
  Processing = "PROCESSING",
  Shipped = "SHIPPED",
  Cancelled = "CANCELLED",
}

export enum OrderItemComplaintStatus {
  CREATED = "CREATED",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
}

export enum OrderItemComplaintType {
  RETURN = "RETURN",
  WARRANTY_CLAIM = "WARRANTY_CLAIM",
}

/**
 * Interface representing an item in the cart
 */
export interface IOrderItem {
  product_id: number;
  product_slug: string;
  product_variant_sku: string;
  product_variant_name: string;
  unit_price_incl_vat: number;
  unit_price_without_vat: number;
  unit_price_without_vat_formatted: string;
  total_price_without_vat_formatted: string;
  unit_price_incl_vat_formatted: string;
  total_price_incl_vat_formatted: string;
  quantity: number;
  discount: number | null;
  primary_image: ICartProductMedia | null;
  complaints: IOrderItemComplaint[];
}

export interface IOrderItemComplaint {
  id: number;
  status: OrderItemComplaintStatus;
  type: OrderItemComplaintType;
  description: string;
  create_at: string;
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
  marketing_flag: boolean;
  agreed_to_terms: boolean;
  payment_id: string | null;
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
