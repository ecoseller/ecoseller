import { IPageCategory, IPageCategoryType } from "@/types/cms";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const getAllPageCategoryTypes = async () => {
  const { body } = await fetch(`/api/cms/category/type`, {
    method: "GET",
  });

  return body;
};

export const createPageCategoryType = async (data: IPageCategoryType) => {
  return await fetch(`/api/cms/category/type`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getPageCategoryType = async (id: number) => {
  const { body } = await fetch(`/api/cms/category/type/${id}/`, {
    method: "GET",
  });
  return body;
};

export const putPageCategoryType = async (
  id: number,
  data: IPageCategoryType
) => {
  const { body } = await fetch(`/api/cms/category/type/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return body;
};

export const deletePageCategoryType = async (id: number) => {
  const { body } = await fetch(`/api/cms/category/type/${id}/`, {
    method: "DELETE",
  });
  return body;
};
