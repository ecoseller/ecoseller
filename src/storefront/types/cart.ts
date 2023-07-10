import { IProductMedia } from "@/types/product";
import { internal_resolveProps } from "@mui/utils";

/**
 * Interface representing an item in the cart
 */
export interface ICartItem {
  id: number;
  product_id: number;
  product_slug: string;
  product_variant_sku: string;
  product_variant_name: string;
  unit_price_without_vat: number;
  unit_price_incl_vat: number;
  total_price_incl_vat_formatted: string;
  total_price_without_vat_formatted: string;
  quantity: number;
  discount: number | null;
  primary_image: IProductMedia | null;
}

export interface ICartData {
  token: string;
  update_at: string;
  total_items_price_incl_vat_formatted: string;
  total_price_incl_vat_formatted: string;
  total_items_price_without_vat_formatted: string;
  total_price_incl_without_vat_formatted: string;
  shipping_method_country: number | null;
  payment_method_country: number | null;
}

export interface ICart extends ICartData {
  cart_items: ICartItem[];
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

export interface ICartDetail {
  token: string;
  user: string;
  shipping_method_country: number;
  payment_method_country: number;
  country: string;
  pricelist: string;
}

export interface IShippingPaymentMethod {
  id: number;
  title: string;
  image: string;
}

interface IShippingPaymentMethodCountry {
  id: number;
  price_incl_vat: string;
}

export interface IShippingMethodCountryWithPaymentMethod
  extends IShippingPaymentMethodCountry {
  shipping_method: IShippingPaymentMethod;
  payment_methods: IPaymentMethodCountry[];
}

export interface IPaymentMethodCountry extends IShippingPaymentMethodCountry {
  payment_method: IShippingPaymentMethod;
}

export interface IShippingMethodCountry extends IShippingPaymentMethodCountry {
  shipping_method: IShippingPaymentMethod;
}
