export interface ICountry {
  code: string;
  name: string;
  locale: string;
  default_price_list: string;
}

export interface IVatGroup {
  id: number;
  name: string;
  rate: number;
  is_default: boolean;
  country: string; // this is country code
}
