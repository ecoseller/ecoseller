import { IEditorJsField } from "@/utils/editorjs/EditorJsOutput";

export interface IPageCMS {
  id: string;
  slug: string;
  title: string;
  content: IEditorJsField;
}
