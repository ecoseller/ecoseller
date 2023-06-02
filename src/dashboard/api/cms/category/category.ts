import { IPageCategory } from "@/types/cms";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const getAllPageCategories = async () => {
  const { body } = await fetch(`/api/cms/category/`, {
    method: "GET",
  });
  return body;
};

export const createPageCategory = async () => {
  return await fetch(`/api/cms/category/`, {
    method: "POST",
    body: JSON.stringify({ type: [] }),
  });
};

export const getPageCategory = async (id: number) => {
  const { body } = await fetch(`/api/cms/category/${id}/`, {
    method: "GET",
  });
  return body;
};

export const putPageCategory = async (id: number, data: IPageCategory) => {
  const { body } = await fetch(`/api/cms/category/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return body;
};

export const deletePageCategory = async (id: number) => {
  return await fetch(`/api/cms/category/${id}/`, {
    method: "DELETE",
  });
};
