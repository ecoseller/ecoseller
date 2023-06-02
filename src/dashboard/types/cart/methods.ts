export interface ISetShippingMethodStateData extends Partial<IShippingMethod> {
  translation?: {
    language: string;
    data: Partial<IShippingMethodTranslation>;
  };
} // Partial<IShippingMethod> is a type that makes all properties of IShippingMethod optional

export enum ActionSetShippingMethod {
  SETINITIAL = "setInitial",
  SETPUBLISHED = "setPublished",
  SETTRANSLATIONS = "setTranslations",
  SETTRANSLATION = "setTranslation",
}

export interface IShippingMethodTranslation {
  title?: string;
  description?: string;
}

export interface IShippingMethodTranslations {
  [locale: string]: IShippingMethodTranslation; // TODO: this needs to be extended according to iso 639 (TLocale)
}

export type TShippingMethodNoImage = Omit<IShippingMethod, "image">;

export interface IShippingMethod {
  id: number;
  translations: IShippingMethodTranslations;
  image: string;
  is_published: boolean;
  create_at: string;
  update_at: string;
}

export interface IShippingMethodCountry {
  id: number;
  country: string;
  shipping_method: number;
  payment_methods: number[];
  currency: string;
  vat_group: number;
  price: number;
  is_active: boolean;
  create_at: string;
  update_at: string;
}

export interface ISetPaymentMethodStateData extends Partial<IShippingMethod> {
  translation?: {
    language: string;
    data: Partial<IPaymentMethodTranslation>;
  };
} // Partial<IShippingMethod> is a type that makes all properties of IPaymentMethod optional

export enum ActionSetPaymentMethod {
  SETINITIAL = "setInitial",
  SETPUBLISHED = "setPublished",
  SETTRANSLATIONS = "setTranslations",
  SETTRANSLATION = "setTranslation",
}

export interface IPaymentMethodTranslation {
  title?: string;
  description?: string;
}

export interface IPaymentMethodTranslations {
  [locale: string]: IPaymentMethodTranslation; // TODO: this needs to be extended according to iso 639 (TLocale)
}

export type TPaymentMethodNoImage = Omit<IShippingMethod, "image">;

export interface IPaymentMethod {
  id: number;
  translations: IShippingMethodTranslations;
  image: string;
  is_published: boolean;
  create_at: string;
  update_at: string;
}

export interface IPaymentMethodCountry {
  id: number;
  country: string;
  payment_method: number;
  currency: string;
  vat_group: number;
  price: number;
  is_active: boolean;
  create_at: string;
  update_at: string;
}

export interface IPaymentMethodCountryFullList {
  id: number;
  country: string;
  payment_method: {
    id: number;
    title: string;
  };
  currency: string;
  vat_group: number;
  price: number;
  is_active: boolean;
  create_at: string;
  update_at: string;
}

/**
 * Base interface for translated shipping/payment methods
 */
interface ITranslatedMethodBase {
  title: string;
  description: string;
  image: string;
}

/**
 * Interface representing translated shipping/payment method country
 */
export interface ITranslatedMethodCountryBase {
  id: number;
  payment_method: ITranslatedMethodBase;
  price_incl_vat: string;
}
