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
  type_name: string;
  unit: string;
}

export interface IBaseAttribute {
  id: number;
  order: number;
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
 * Interface representing product record
 */
export interface IProductRecord extends IProductBase {
  primary_image: IProductMedia;
  price: string;
  has_multiple_prices: boolean;
}
