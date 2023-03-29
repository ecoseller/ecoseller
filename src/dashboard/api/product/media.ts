import { IProductMedia } from "@/types/product";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const postProductMedia = async (formData: FormData) => {
  return await axiosPrivate.post(`/product/dashboard/media/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProductMedia = async (id: number) => {
  return await axiosPrivate.delete(`/product/dashboard/media/${id}/`);
};

export const putProductMedia = async (
  id: number,
  mediaData: Partial<IProductMedia>
) => {
  console.log("mediaData", mediaData);
  return await axiosPrivate.put(`/product/dashboard/media/${id}/`, mediaData);
};
