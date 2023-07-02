import { IEditorJsField } from "@/utils/editorjs/EditorJsOutput";
import { IBreadcrumbObject } from "@/types/common";

export interface IProductSliderData {
  id: number;
  title: string;
  price: string;
  image: string;
  url: string;
}

export interface IAttributeType {
  id: number;
  name: string;
  unit: string;
  is_numeric: boolean;
}

export interface IBaseAttribute {
  id: number;
  order: number;
  name: string;
  value: string;
  type: IAttributeType;
}

export interface IProductPrice {
  without_vat: string;
  incl_vat: string;
  vat: string;
  discount: {
    percentage: number;
    without_vat: string;
    incl_vat: string;
  };
}

export interface IProductVariant {
  sku: string;
  ean: string;
  weight: number;
  stock_quantity: number;
  price: IProductPrice;
  attributes: IBaseAttribute[];
}

export interface IProductMedia {
  id: number;
  media: string;
  type: "IMAGE" | "VIDEO";
  alt: string | null;
}

interface IProductBase {
  id: number;
  title: string;
  meta_title: string;
  meta_description: string;
  slug: string;
}

export interface IProductDetail extends IProductBase, IBreadcrumbObject {
  description: string;
  short_description: string;
  description_editorjs: IEditorJsField;
  product_variants: IProductVariant[];
  media: IProductMedia[];
}

/**
 * Interface representing price data of a product variant
 */
export interface IProductVariantPrice {
  without_vat: number;
  incl_vat: number;
  without_vat_formatted: string;
  incl_vat_formatted: string;
  discount: number | null;
}

/**
 * Interface representing product record
 */
export interface IProductRecord extends IProductBase {
  primary_image: IProductMedia;
  variant_prices: IProductVariantPrice[];
}

/**
 * Base interface representing attribute type
 */
export interface IAttributeTypeBase {
  id: number;
  name: string;
  unit: string | null;
}

/**
 * Interface representing attribute type together with its possible values
 */
export interface IAttributeTypeWithOptions<T> extends IAttributeTypeBase {
  possible_values: T[];
}
