export type TLocale<T extends string> = "cs" | "sk" | "en" | "de" | "pl";

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
  is_default: boolean;
  rounding: boolean;
  update_at: string;
}

/**
 * Interface representing language of an app
 */
export interface ILanguage {
  code: string;
  default: boolean;
}
