import { axiosPrivate } from "@/utils/axiosPrivate";
import { ICategoryLocalized, ICategoryCreateUpdate } from "@/types/category";

/**
 * Get list of all categories
 */
export const getAllCategories = async () => {
  return await axiosPrivate.get<ICategoryLocalized[]>(`/category/`);
};

export const addCategory = async (categoryToAdd: ICategoryCreateUpdate) => {
  return await axiosPrivate.post(`/category/`, categoryToAdd);
};
