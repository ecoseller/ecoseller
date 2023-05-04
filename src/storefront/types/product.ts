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

export interface IProductVariant {
  sku: string;
  ean: string;
  weight: number;
  availability: number;
  price: string;
  attribtues: IBaseAttribute[];
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
  description_editorjs: DataProp;
  slug: string;
  product_variants: IProductVariant[];
  media: IProductMedia[];
}
