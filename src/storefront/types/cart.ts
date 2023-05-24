import { IProductMedia } from "@/types/product";

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
  total_price_net_formatted: string;
  quantity: number;
  discount: number | null;
  primary_image: IProductMedia | null;
}

export interface ICart {
  cart_items: ICartItem[];
  update_at: string;
  total_price_net_formatted: string;
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

export interface ICountryOption {
  code: string;
  name: string;
}
