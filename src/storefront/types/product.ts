export interface IProductSliderData {
  id: number;
  title: string;
  price: string;
  image: string;
  url: string;
}

export interface IProductMedia {
  id: number;
  type: "IMAGE" | "VIDEO";
  product_id: number;
  media: string;
}
