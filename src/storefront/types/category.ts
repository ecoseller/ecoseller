import { IEditorJsField } from "@/utils/editorjs/EditorJsOutput";
import { IBreadcrumbObject } from "@/types/common";
import {
  IAttributeTypeBase,
  IAttributeTypeWithOptions,
} from "@/types/attributes";

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

export interface IAttributeSet {
  numeric: IAttributeTypeWithOptions<number>[];
  textual: IAttributeTypeWithOptions<string>[];
}

/**
 * Represents selected category filters by an user
 */
export interface ISelectedFilters {
  textual: ITextualFilter[];
  numeric: INumericFilter[];
}

/**
 * Represents a textual filter with choices
 */
export interface ITextualFilter {
  id: number;
  selected_values_ids: number[];
}

/**
 * Represents a numeric filter with selected min and max value
 */
export interface INumericFilter extends IAttributeTypeBase {
  id: number;
  min_value_id: number | null;
  max_value_id: number | null;
}

/**
 * Represents selected category filters with an ordering included
 */
export interface ISelectedFiltersWithOrdering {
  filters: ISelectedFilters;
  sort_by: string | null;
  order: string | null;
}
