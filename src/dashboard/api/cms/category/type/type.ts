import { IPageCategory, IPageCategoryType } from "@/types/cms";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const getAllPageCategoryTypes = async () => {
  const { data } = await axiosPrivate.get("/cms/category/type/");
  return data;
};

export const createPageCategoryType = async (body: IPageCategoryType) => {
  const { data } = await axiosPrivate.post("/cms/category/type/", body);
  return data;
};

export const getPageCategoryType = async (id: number) => {
  const { data } = await axiosPrivate.get(`/cms/category/type/${id}/`);
  return data;
};

export const putPageCategoryType = async (
  id: number,
  body: IPageCategoryType
) => {
  const { data } = await axiosPrivate.put(`/cms/category/type/${id}/`, body);
  return data;
};

export const deletePageCategoryType = async (id: number) => {
  const { data } = await axiosPrivate.delete(`/cms/category/type/${id}/`);
  return data;
};
