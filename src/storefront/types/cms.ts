import { IEditorJsField } from "@/utils/editorjs/EditorJsOutput";

export interface IPageCMS {
  id: string;
  slug: string;
  title: string;
  content: IEditorJsField;
}

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
