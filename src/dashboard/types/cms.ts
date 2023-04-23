type TPageResource = "PageCMS" | "PageFrontend";

export interface IPageCMSTranslation {
  [locale: string]: {
    title: string;
    content: string;
    slug: string;
  };
}

export interface IPageCMS {
  id: number;
  translations: IPageCMSTranslation;
  resourcetype: TPageResource;
}

export interface IPageFrontendTranslation {
  [locale: string]: { title: string };
}

export interface IPageFrontend {
  id: number;
  translations: IPageFrontendTranslation;
  frontend_path: string;
  resourcetype: TPageResource;
}

export type TPage = IPageCMS | IPageFrontend;
