import { DataProp } from "@/utils/editorjs/EditorJsOutput";

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
export interface ICategoryDetail extends ICategoryBase {
  description_editorjs: DataProp;
  meta_description: string;
}
