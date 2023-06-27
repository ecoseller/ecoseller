export interface IPageCategory {
  id: number;
  title: string;
  code: string;
  page: IPagePreview[];
}

export interface IPagePreview {
  id: number;
  title: string;
  slug: string;
  resourcetype: "PageCMS" | "PageFrontend";
}
