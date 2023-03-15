export interface ICurrency {
  code: string;
  name: string;
  symbol: string;
  symbol_position: "BEFORE" | "AFTER";
  update_at: string;
}

export interface IPriceList {
  code: string;
  currency: number;
  rounding: boolean;
  includes_vat: boolean;
  update_at: string;
}
