export interface ICategory extends ICategoryMenu {
  desciption: string;
}

export interface ICategoryMenu {
  id: number;
  published: boolean;
  title: string;
  slug: string;
  create_at: string;
  update_at: string;
  children: ICategoryMenu[];
}
