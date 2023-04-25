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
}

export interface IEntityTranslations {
  [locale: string]: IEntityTranslation; // TODO: this needs to be extended according to iso 639 (TLocale)
}
