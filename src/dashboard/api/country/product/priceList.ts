import { IPriceList } from "@/types/localization";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const deletePriceList = async (code: string) => {
  // Delete price list by code
  // URL: /api/product/pricelist/:code/
  // Method: DELETE
  // Params: code
  // Return: Promise
  return fetch(`/api/product/price-list/${code}/`, {
    method: "DELETE",
  });
};

export const postPriceList = async (data: IPriceList) => {
  // Create new price list
  // URL: /api/product/pricelist/
  // Method: POST
  // Params: data
  // Return: Promise
  return fetch(`/api/product/price-list/`, {
    method: "POST",
    body: JSON.stringify(data as IPriceList),
  });
};

export const putPriceList = async (code: string, data: IPriceList) => {
  // Update price list
  // URL: /api/product/pricelist/
  // Method: PUT
  // Params: data
  // Return: Promise
  return fetch(`/api/product/price-list/${code}/`, {
    method: "PUT",
    body: JSON.stringify(data as IPriceList),
  });
};
