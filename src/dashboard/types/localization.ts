export type TLocale<T extends string> = "cs" | "sk" | "en" | "de" | "pl"; // TODO: this needs to be extended according to iso 639

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

/**
 * Interface representing language of an app
 */
export interface ILanguage {
  code: string;
  default: boolean;
}
