import { axiosPrivate } from "@/utils/axiosPrivate";
import {
  ICategoryLocalized,
  ICategoryEditable,
  ICategoryDetail,
} from "@/types/category";

/**
 * Get list of all categories
 */
export const getAllCategories = async () => {
  return await axiosPrivate.get<ICategoryLocalized[]>("dashboard/category/");
};

/**
 * Create new category
 * @param categoryToAdd
 */
export const addCategory = async (categoryToAdd: ICategoryEditable) => {
  return await axiosPrivate.post("dashboard/category/", categoryToAdd);
};

/**
 * Get category by its id
 * @param id
 */
export const getCategory = async (id: string) => {
  return await axiosPrivate.get<ICategoryDetail>(`dashboard/category/${id}`);
};

/**
 * Update properties of the selected category
 * @param id id of the category to update
 * @param updatedCategory
 */
export const updateCategory = async (
  id: string,
  updatedCategory: ICategoryEditable
) => {
  return await axiosPrivate.put(`dashboard/category/${id}`, updatedCategory);
};

/**
 * Delete category by its id
 * @param id
 */
export const deleteCategory = async (id: string) => {
  return await axiosPrivate.delete(`dashboard/category/${id}`);
};
