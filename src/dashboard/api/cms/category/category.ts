import { IPageCategory } from "@/types/cms";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const getAllPageCategories = async () => {
  const { data } = await axiosPrivate.get("/cms/category/");
  return data;
};

export const createPageCategory = async () => {
  const { data } = await axiosPrivate.post("/cms/category/", { type: [] });
  return data;
};

export const getPageCategory = async (id: number) => {
  const { data } = await axiosPrivate.get(`/cms/category/${id}/`);
  return data;
};

export const putPageCategory = async (id: number, body: IPageCategory) => {
  const { data } = await axiosPrivate.put(`/cms/category/${id}/`, body);
  return data;
};

export const deletePageCategory = async (id: number) => {
  const { data } = await axiosPrivate.delete(`/cms/category/${id}/`);
  return data;
};
