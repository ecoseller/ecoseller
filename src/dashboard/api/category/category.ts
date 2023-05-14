import {
  ICategoryLocalized,
  ICategoryEditable,
  ICategoryDetail,
} from "@/types/category";
import axios from "axios";
import { axiosNextApiInstance } from "@/utils/axiosNextApiInstance";

/**
 * Get list of all categories
 */
export const getAllCategories = async () => {
  return await axiosNextApiInstance.get<ICategoryLocalized[]>("/api/category/");
};

/**
 * Create new category
 * @param categoryToAdd
 */
export const addCategory = async (categoryToAdd: ICategoryEditable) => {
  return await axiosNextApiInstance.post<ICategoryDetail>(
    "/api/category/",
    categoryToAdd
  );
};

/**
 * Get category by its id
 * @param id
 */
export const getCategory = async (id: string) => {
  return await axiosNextApiInstance.get<ICategoryDetail>(
    `/api/category/${id}/`
  );
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
  return await axiosNextApiInstance.put(
    `/api/category/${id}/`,
    updatedCategory
  );
};

/**
 * Delete category by its id
 * @param id
 */
export const deleteCategory = async (id: string) => {
  return await axiosNextApiInstance.delete(`/api/category/${id}/`);
};
