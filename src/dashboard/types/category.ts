/**
 * Interface representing set of translatable fields of a category
 */
export interface ICategoryTranslation {
  title: string;
  meta_title: string;
  meta_description: string;
  description: string;
  slug: string;
}

/**
 * Interface used for creating or updating a Category
 */
export interface ICategoryEditable {
  published: boolean;
  translations: { [locale: string]: ICategoryTranslation };
  parent: number | null;
}

/**
 * Interface containing detailed info about a Category
 * (including all available translations of localized fields)
 */
export interface ICategoryDetail extends ICategoryEditable {
  id: number;
  create_at: string;
  update_at: string;
}

/**
 * Interface containing info about a Category.
 * Localized fields are present only in 1 language.
 */
export interface ICategoryLocalized extends ICategoryTranslation {
  id: number;
  published: boolean;
  create_at: string;
  update_at: string;
  children: ICategoryLocalized[];
}
