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
