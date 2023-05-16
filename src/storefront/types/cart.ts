export interface CartItem {
  product_variant: string;
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
