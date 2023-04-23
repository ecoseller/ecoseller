import { Page } from "@/types/cms";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const getAllPages = async (): Promise<Page[]> => {
  // Get all CMS Pages
  // URL: /cms/
  // Method: GET
  // Params: data
  // Return: Promise
  const { data } = await axiosPrivate.get("/cms/");
  return data;
};
