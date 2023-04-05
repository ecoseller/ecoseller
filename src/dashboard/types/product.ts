import { IPaginated } from "@/types/common";
import { IPriceList, TLocale } from "./localization";

export interface ISetProductStateData extends Partial<IProduct> {
  translation?: {
    language: string;
    data: Partial<IProductTranslation>;
  };
} // Partial<IProduct> is a type that makes all properties of IProduct optional

export enum ActionSetProduct {
  SETINITIAL = "setInitial",
  SETID = "setId",
  SETPUBLISHED = "setPublished",
  SETCATEGORY = "setCategory",
  SETTRANSLATIONS = "setTranslations",
  SETTRANSLATION = "setTranslation",
  SETPRODUCTVARIANTS = "setVariants",
  SETMEDIA = "setMedia",
  SETPRODUCTTYPEID = "setProductTypeId",
  SETPRODUCTTYPE = "setProductType",
}

export interface IProductTranslation {
  title?: string;
  description?: string;
  short_description?: string;
  slug?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface IProductTranslations {
  [locale: string]: IProductTranslation; // TODO: this needs to be extended according to iso 639 (TLocale)
}

export interface IProductMedia {
  id: number;
  type: "IMAGE" | "VIDEO";
  product_id: number;
  media: string;
  sort_order: number;
}
export interface IProductType {
  id?: number;
  name: string;
  allowed_attribute_types?: IAttributeType[];
  allowed_attribute_types_ids?: number[];
}

export interface IProduct {
  id: number | null;
  published: boolean;
  category: number | null;
  translations: IProductTranslations;
  product_variants: IProductVariant[];
  media: IProductMedia[];
  update_at?: string;
  create_at?: string;
  type?: IProductType;
  type_id: number;
}

export interface IProductVariant {
  sku: string;
  ean: string;
  weight: number;
  attributes: number[];
  price: IProductPrice[];
}

export interface IProductPrice {
  price_list: IPriceList | string;
  price: number;
}

export interface IProductListItem {
  id: string;
  title: string | null;
  primary_image: string | null;
  published: boolean;
  update_at: string;
}

export interface IProductList extends IPaginated {
  data: IProductListItem[];
}

export interface IBaseAttributePostRequest {
  id?: number;
  value: string;
  type: number;
}

export interface IBaseAttribute extends IBaseAttributePostRequest {
  id: number;
}

export interface IAttributeTypePostRequest {
  id?: number;
  type_name: string;
  unit?: string;
  base_attributes: IBaseAttribute[];
}

export interface IAttributeType extends IAttributeTypePostRequest {
  id: number;
}
