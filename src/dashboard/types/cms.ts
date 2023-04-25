import { OutputData as IEditorJSData } from "@editorjs/editorjs";

export interface ISetPageStorefrontStateData extends Partial<IPageFrontend> {
  translation?: {
    language: string;
    data: Partial<IPageFrontendTranslationFields>;
  };
} // Partial<IPageFrontend> is a type that makes all properties of IPageFrontend optional
export interface ISetPageCMSStateData extends Partial<IPageCMS> {
  translation?: {
    language: string;
    data: Partial<IPageCMSTranslationFields>;
  };
} // Partial<IPageFrontend> is a type that makes all properties of IPageFrontend optional

export enum ActionSetPageStorefront {
  SETINITIAL = "setInitial",
  SETPUBLISHED = "setPublished",
  SETTRANSLATIONS = "setTranslations",
  SETTRANSLATION = "setTranslation",
  SETFRONTENDPATH = "setFrontendPath",
  SETCATEGORIES = "setCategories",
}

export enum ActionSetPageCMS {
  SETINITIAL = "setInitial",
  SETPUBLISHED = "setPublished",
  SETTRANSLATIONS = "setTranslations",
  SETTRANSLATION = "setTranslation",
  SETCATEGORIES = "setCategories",
}

type TPageResource = "PageCMS" | "PageFrontend";

export interface IPageCMSTranslationFields {
  title: string;
  content: IEditorJSData;
  slug: string;
}
export interface IPageCMSTranslation {
  [locale: string]: IPageCMSTranslationFields;
}

export interface IPageCMS {
  id: number;
  translations: IPageCMSTranslation;
  resourcetype: TPageResource;
  published: boolean;
  categories?: number[];
}

export interface IPageFrontendTranslationFields {
  title: string;
}

export interface IPageFrontendTranslation {
  [locale: string]: IPageFrontendTranslationFields;
}

export interface IPageFrontend {
  id: number;
  translations: IPageFrontendTranslation;
  frontend_path: string;
  resourcetype: TPageResource;
  published: boolean;
  categories?: number[];
}

export type TPage = IPageCMS | IPageFrontend;

/**
 * Category
 */

export enum ActionSetPageCategory {
  SETINITIAL = "setInitial",
  SETPUBLISHED = "setPublished",
  SETCODE = "setCode",
  SETTRANSLATIONS = "setTranslations",
  SETTRANSLATION = "setTranslation",
  SETTYPE = "setType",
}

export interface ISetPageCategoryStateData extends Partial<IPageCategory> {
  translation?: {
    language: string;
    data: Partial<IPageCategoryTranslationFields>;
  };
}

export interface IPageCategoryTranslationFields {
  title: string;
}

export interface IPageCategoryTranslation {
  [locale: string]: IPageCategoryTranslationFields;
}

export interface IPageCategory {
  id: number;
  published: boolean;
  code: string;
  translations: IPageCategoryTranslation;
  type: number[];
}

export interface IPageCategoryType {
  id: number;
  identifier: string;
}
