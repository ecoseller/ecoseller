import { DataProp } from "@/utils/editorjs/Output";

export interface IProductSliderData {
  id: number;
  title: string;
  price: string;
  image: string;
  url: string;
}

export interface IBreadcrumb {
  id: number;
  title: string;
  slug: string;
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
  alt: string;
}

export interface IProduct {
  id: number;
  breadcrumbs: IBreadcrumb[];
  title: string;
  meta_title: string;
  meta_description: string;
  description: string;
  short_description: string;
  description_editorjs: DataProp;
  slug: string;
  product_variants: IProductVariant[];
  media: IProductMedia[];
}
