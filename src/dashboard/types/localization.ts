export interface ICurrency {
  code: string;
  name: string;
  symbol: string;
  symbol_position: "BEFORE" | "AFTER";
  update_at: string;
}
