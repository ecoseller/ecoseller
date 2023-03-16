import { IProduct } from "@/types/product";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const postProduct = async (data: IProduct) => {
  // Create new product
  // URL: /product/dashboard/product/
  // Method: POST
  // Params: data
  // Return: Promise
  return await axiosPrivate.post(`/product/dashboard/detail/`, data);
};

export const putProduct = async (data: IProduct) => {
  // Update product
  // URL: /product/dashboard/product/
  // Method: PUT
  // Params: data
  // Return: Promise
  if (!data.id) throw new Error("Product id is required to update product");
  console.log("putProduct", data);
  return await axiosPrivate.put(`/product/dashboard/detail/${data.id}/`, data);
};
