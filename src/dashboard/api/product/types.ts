import { IProductType } from "@/types/product";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const postProductType = async (data: IProductType) => {
  // Create new product type
  // URL: /product/dashboard/type/
  // Method: POST
  // Params: data
  // Return: Promise
  console.log("postProductType", data);
  return await axiosPrivate.post(`/product/dashboard/type/`, data);
};

export const putProductType = async (data: IProductType) => {
  // Update ProductType
  // URL: /product/dashboard/type/<id>/
  // Method: PUT
  // Params: data
  // Return: Promise
  if (!data.id) throw new Error("ProductType id is required to update product");
  console.log("putProductType", data);
  return await axiosPrivate.put(`/product/dashboard/type/${data.id}/`, data);
};
