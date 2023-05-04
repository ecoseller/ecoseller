export interface ICountry {
  code: string;
  name: string;
  locale: string;
}

export interface IVatGroup {
  id: number;
  name: string;
  rate: number;
  country: string; // this is country code
}
