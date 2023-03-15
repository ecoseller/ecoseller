import { IPaginated } from "@/types/common";
import { TLocale } from "./localization";

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

export interface IProduct {
  id: string | null;
  published: boolean;
  category: number | null;
  translations: IProductTranslations;
  product_variants: number[];
  product_media: number[];
  update_at?: string;
  create_at?: string;
}

export interface IProductVariant {
  sku: string;
  ean: string;
  weight: number;
  attributes: number[];
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
