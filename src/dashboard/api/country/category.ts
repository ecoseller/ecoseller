import { axiosPrivate } from "@/utils/axiosPrivate";
import { ICategoryLocalized } from "@/types/category";

export const getAllCategories = async () =>
{
  return await axiosPrivate.get<ICategoryLocalized[]>(`/category/`);
};