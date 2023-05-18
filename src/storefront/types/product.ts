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
  media: string;
  alt: string | null;
}
