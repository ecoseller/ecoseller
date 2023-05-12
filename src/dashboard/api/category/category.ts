import {
  ICategoryLocalized,
  ICategoryEditable,
  ICategoryDetail,
} from "@/types/category";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3030/",
  timeout: 1000
});

/**
 * Get list of all categories
 */
export const getAllCategories = async () => {
  return await axiosInstance.get<ICategoryLocalized[]>("/api/category/");
};

/**
 * Create new category
 * @param categoryToAdd
 */
export const addCategory = async (categoryToAdd: ICategoryEditable) => {
  return await axiosInstance.post<ICategoryDetail>("/api/category/", categoryToAdd);
};

/**
 * Get category by its id
 * @param id
 */
export const getCategory = async (id: string) => {
  return await axiosInstance.get<ICategoryDetail>(`/api/category/${id}/`);
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
  return await axiosInstance.put(`/api/category/${id}/`, updatedCategory);
};

/**
 * Delete category by its id
 * @param id
 */
export const deleteCategory = async (id: string) => {
  return await axiosInstance.delete(`/api/category/${id}/`);
};
