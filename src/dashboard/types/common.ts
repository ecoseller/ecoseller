import { OutputData } from "@editorjs/editorjs";

type TLink = string | null;
export interface IPaginated {
  links: {
    next: TLink;
    prev: TLink;
  };
  count: number;
  total_pages: number;
  results: any[];
}

export interface IEntityTranslation {
  meta_title?: string;
  meta_description?: string;
  title?: string;
  description?: string;
  description_editorjs?: OutputData;
  short_description?: string;
  slug?: string;
  name?: string;
}

export interface IEntityTranslations {
  [locale: string]: IEntityTranslation;
}

export type HTTPMETHOD = "GET" | "POST" | "PUT" | "DELETE";
