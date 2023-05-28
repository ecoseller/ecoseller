import { IPageCMS, IPageFrontend, TPage } from "@/types/cms";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const getAllPages = async (): Promise<TPage[]> => {
  // Get all CMS Pages
  // URL: /cms/
  // Method: GET
  // Params: data
  // Return: Promise
  return fetch(`/api/cms/`, {
    method: "GET",
  }).then((res) => res.json());
};

export const createNewFrontendPage = async () => {
  // Create new CMS Page
  // URL: /cms/
  // Method: POST
  // Return: Promise

  return fetch(`/api/cms/page/`, {
    method: "POST",
    body: JSON.stringify({ resourcetype: "PageFrontend", frontend_path: "/" }),
  }).then((res) => res.json());
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

  return fetch(`/api/cms/page/frontend/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  }).then((res) => res.json());
};
export const deleteFrontendPage = async (id: number) => {
  // Delete Frontend Page
  // URL: /cms/frontend/{id}/
  // Method: DELETE
  // Params: id

  return fetch(`/api/cms/page/frontend/${id}/`, {
    method: "DELETE",
  }).then((res) => res.json());
};

export const getFrontendPage = async (id: number): Promise<IPageFrontend> => {
  // GET Frontend Page
  // URL: /cms/frontend/{id}/
  // Method: GET
  // Params: id
  // Return: Promise<IPageFrontend>

  return fetch(`/api/cms/page/frontend/${id}/`, {
    method: "GET",
  }).then((res) => res.json());
};

export const createNewCMSPage = async () => {
  // Create new CMS Page
  // URL: /cms/
  // Method: POST
  // Return: Promise
  const response = await axiosPrivate.post("/cms/", {
    resourcetype: "PageCMS",
  });
  return response.data;
};

export const putCMSPage = async (id: number, data: Partial<IPageCMS>) => {
  // Update CMS Page
  // URL: /cms/cms/{id}/
  // Method: PUT
  // Params: id, data
  // Return: Promise

  return fetch(`/api/cms/page/cms/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  }).then((res) => res.json());
};
export const deleteCMSPage = async (id: number) => {
  // Delete CMS Page
  // URL: /cms/cms/{id}/
  // Method: DELETE
  // Params: id

  return fetch(`/api/cms/page/cms/${id}/`, {
    method: "DELETE",
  }).then((res) => res.json());
};
export const getCMSPage = async (id: number): Promise<IPageFrontend> => {
  // GET CMS Page
  // URL: /cms/cms/{id}/
  // Method: GET
  // Params: id
  // Return: Promise<IPageFrontend>

  return fetch(`/api/cms/page/cms/${id}/`, {
    method: "GET",
  }).then((res) => res.json());
};
