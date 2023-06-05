import { IProductMedia } from "@/types/product";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const postProductMedia = async (body: any) => {
  return await fetch("/api/product/media", {
    method: "POST",
    body: JSON.stringify(body),
    // headers: {
    // "Content-Type": "multipart/form-data",
    // },
  }).then((res) => res.json());
};

export const deleteProductMedia = async (id: number) => {
  return await fetch(`/api/product/media/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
};

export const putProductMedia = async (
  id: number,
  mediaData: Partial<IProductMedia>
) => {
  console.log("mediaData", mediaData);
  return await fetch(`/api/product/media/${id}`, {
    method: "PUT",
    body: JSON.stringify(mediaData),
  }).then((res) => res.json());
};
