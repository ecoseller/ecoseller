import { IPageCMS, IPageFrontend, TPage } from "@/types/cms";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const getAllPages = async (): Promise<TPage[]> => {
  // Get all CMS Pages
  // URL: /cms/
  // Method: GET
  // Params: data
  // Return: Promise
  const { data } = await axiosPrivate.get("/cms/");
  return data;
};

export const putFrontendPage = async (
  id: number,
  data: Partial<IPageFrontend>
) => {
  // Update Frontend Page
  // URL: /cms/frontend/{id}/
  // Method: PUT
  // Params: id, data
  // Return: Promise
  const response = await axiosPrivate.put(`/cms/page/frontend/${id}/`, data);
  return response.data;
};
export const deleteFrontendPage = async (id: number) => {
  // Delete Frontend Page
  // URL: /cms/frontend/{id}/
  // Method: DELETE
  // Params: id
  const response = await axiosPrivate.delete(`/cms/page/frontend/${id}/`);
  return response.data;
};
export const getFrontendPage = async (id: number): Promise<IPageFrontend> => {
  // GET Frontend Page
  // URL: /cms/frontend/{id}/
  // Method: GET
  // Params: id
  // Return: Promise<IPageFrontend>
  const response = await axiosPrivate.get(`/cms/page/frontend/${id}/`);
  return response.data;
};

export const putCMSPage = async (id: number, data: Partial<IPageCMS>) => {
  // Update CMS Page
  // URL: /cms/cms/{id}/
  // Method: PUT
  // Params: id, data
  // Return: Promise
  const response = await axiosPrivate.put(`/cms/page/cms/${id}/`, data);
  return response.data;
};
export const deleteCMSPage = async (id: number) => {
  // Delete CMS Page
  // URL: /cms/cms/{id}/
  // Method: DELETE
  // Params: id
  const response = await axiosPrivate.delete(`/cms/page/cms/${id}/`);
  return response.data;
};
export const getCMSPage = async (id: number): Promise<IPageFrontend> => {
  // GET CMS Page
  // URL: /cms/cms/{id}/
  // Method: GET
  // Params: id
  // Return: Promise<IPageFrontend>
  const response = await axiosPrivate.get(`/cms/page/cms/${id}/`);
  return response.data;
};
