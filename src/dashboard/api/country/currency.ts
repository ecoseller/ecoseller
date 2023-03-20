import { ICurrency } from "@/types/localization";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const deleteCurrency = async (code: string) => {
  // Delete currency by code
  // URL: /country/currency/:code
  // Method: DELETE
  // Params: code
  // Return: Promise
  return await axiosPrivate.delete(`/country/currency/${code}`);
};

export const postCurrency = async (data: ICurrency) => {
  // Create new currency
  // URL: /country/currency
  // Method: POST
  // Params: data
  // Return: Promise
  return await axiosPrivate.post(`/country/currency/`, data);
};

export const putCurrency = async (data: ICurrency) => {
  // Update currency
  // URL: /country/currency
  // Method: PUT
  // Params: data
  // Return: Promise
  return await axiosPrivate.put(`/country/currency/${data.code}/`, data);
};
