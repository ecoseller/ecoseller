import { IPaginated } from "@/types/common";

export interface IProductListItem {
  id: string;
  title: string | null;
  primary_image: string | null;
  published: boolean;
  update_at: string;
}

export interface IProductList extends IPaginated {
  data: IProductListItem[];
}
