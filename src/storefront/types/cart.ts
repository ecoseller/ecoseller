export interface CartItem {
  product: number;
  product_variant: string;
  product_variant_name: string;
  unit_price_gross: number;
  unit_price_net: number;
  quantity: number;
}

export interface Cart {
  token: string;
  update_at: string;
  create_at: string;
  cart_items: CartItem[];
}
