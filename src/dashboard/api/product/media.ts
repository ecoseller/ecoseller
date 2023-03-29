import { axiosPrivate } from "@/utils/axiosPrivate";

export const postProductMedia = async (formData: FormData) => {
  return await axiosPrivate.post(`/product/dashboard/media/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
