import { IEditorJsField } from "@/utils/editorjs/EditorJsOutput";
import { IBreadcrumbObject } from "@/types/common";

/**
 * Interface containing basic info about a category
 */
export interface ICategoryBase {
  id: number;
  title: string;
  meta_title: string;
  slug: string;
  children: ICategoryBase[];
}

/**
 * Interface containing detailed info about a category
 */
export interface ICategoryDetail extends ICategoryBase, IBreadcrumbObject {
  description_editorjs: IEditorJsField;
  meta_description: string;
}
