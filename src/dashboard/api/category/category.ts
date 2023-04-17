import { axiosPrivate } from "@/utils/axiosPrivate";
import { ICategoryLocalized, ICategoryCreateUpdate, ICategoryDetail } from "@/types/category";

/**
 * Get list of all categories
 */
export const getAllCategories = async () => {
  return await axiosPrivate.get<ICategoryLocalized[]>(`/category/`);
};

/**
 * Create new category
 * @param categoryToAdd
 */
export const addCategory = async (categoryToAdd: ICategoryCreateUpdate) => {
  return await axiosPrivate.post(`/category/`, categoryToAdd);
};

/**
 * Get category by its id
 * @param id
 */
export const getCategory = async (id: string) => {
  return await axiosPrivate.get<ICategoryDetail>(`/category/${id}`);
};

/**
 * 
 * @param id
 * @param updatedCategory
 */
export const updateCategory = async (id: string, updatedCategory: ICategoryCreateUpdate) => {
  return await axiosPrivate.put(`/category/${id}`, updatedCategory);
};