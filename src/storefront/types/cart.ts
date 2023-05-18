import { IProductMedia } from "@/types/product";

export interface ICartItem {
  product: number;
  product_variant: string;
  product_variant_name: string;
  unit_price_gross: number;
  unit_price_net: number;
  quantity: number;
  discount: number | null;
  primary_image: IProductMedia;
}

export interface ICart {
  cart_items: ICartItem[];
  update_at: string;
  currency_symbol: string;
  symbol_position: "BEFORE" | "AFTER";
}
