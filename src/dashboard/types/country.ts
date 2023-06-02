export interface ICountryBase {
  code: string;
  name: string;
}

export interface ICountry extends ICountryBase {
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
