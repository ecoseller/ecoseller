import {
  ICategoryLocalized,
  ICategoryEditable,
  ICategoryDetail,
} from "@/types/category";

/**
 * Get list of all categories
 */
export const getAllCategories = async () => {
  return fetch("/api/category/")
    .then((res) => res.json())
    .then((data) => data as ICategoryLocalized[]);
};

/**
 * Create new category
 * @param categoryToAdd
 */
export const addCategory = async (categoryToAdd: ICategoryEditable) => {
  return fetch("/api/category/", {
    method: "POST",
    body: JSON.stringify(categoryToAdd),
  })
    .then((res) => res.json())
    .then((data) => data as ICategoryDetail);
};

/**
 * Get category by its id
 * @param id
 */
export const getCategory = async (id: string) => {
  return fetch(`/api/category/${id}`)
    .then((res) => res.json())
    .then((data) => data as ICategoryDetail);
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
  return fetch(`/api/category/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedCategory),
  }).then((res) => res.json());
};

/**
 * Delete category by its id
 * @param id
 */
export const deleteCategory = async (id: string) => {
  return fetch(`/api/category/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
};
