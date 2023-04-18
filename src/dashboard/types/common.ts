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
