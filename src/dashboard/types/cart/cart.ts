/**
 * Interface representing an item in the cart
 */
export interface ICartItem {
  product_id: number;
  product_slug: string;
  product_variant_sku: string;
  product_variant_name: string;
  unit_price_gross: number;
  unit_price_net: number;
  unit_price_net_formatted: string;
  total_price_net_formatted: string;
  quantity: number;
  discount: number | null;
  primary_image: ICartProductMedia | null;
}

export interface ICart {
  token: string;
  cart_items: ICartItem[];
  update_at: string;
  total_items_price_net_formatted: string;
  total_price_net_formatted: string;
  shipping_method_country: number | null;
  payment_method_country: number | null;
}

export interface ICartToken {
  token: string;
}

export interface Address {
  id?: number;
  first_name: string;
  surname: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface IBillingInfo extends Address {
  company_name: string;
  company_id: string;
  vat_number: string;
}

export interface IShippingInfo extends Address {
  email: string;
  phone: string;
  additional_info: string;
}

export interface ICartProductMedia {
  id: number;
  type: "IMAGE" | "VIDEO";
  media: string;
  alt: string | null;
}
