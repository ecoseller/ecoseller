import { IPriceList } from "@/types/localization";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const deletePriceList = async (code: string) => {
  // Delete price list by code
  // URL: /product/dashboard/pricelist/:code/
  // Method: DELETE
  // Params: code
  // Return: Promise
  return await axiosPrivate.delete(`/product/dashboard/pricelist/${code}/`);
};

export const postPriceList = async (data: IPriceList) => {
  // Create new price list
  // URL: /product/dashboard/pricelist/
  // Method: POST
  // Params: data
  // Return: Promise
  return await axiosPrivate.post(`/product/dashboard/pricelist/`, data);
};

export const putPriceList = async (data: IPriceList) => {
  // Update price list
  // URL: /product/dashboard/pricelist/
  // Method: PUT
  // Params: data
  // Return: Promise
  return await axiosPrivate.put(
    `/product/dashboard/pricelist/${data.code}/`,
    data
  );
};
