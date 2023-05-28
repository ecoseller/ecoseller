import { ICountry } from "@/types/country";
import { ICurrency, ILanguage } from "@/types/localization";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const deleteCountry = async (code: string) => {
  // Delete country
  // URL: /api/country/<code>
  // Method: POST
  // Params: data
  // Return: Promise
  return fetch(`/api/country/${code}`, {
    method: "DELETE",
  });
};

export const postCoutry = async (data: ICountry) => {
  // Create country
  // URL: /api/country/
  // Method: POST
  // Params: data
  // Return: Promise
  return fetch(`/api/country/`, {
    method: "POST",
    body: JSON.stringify(data as ICountry),
  });
};

export const putCountry = async (code: string, data: ICountry) => {
  // Update country
  // URL: /api/country/<code>
  // Method: PUT
  // Params: data
  // Return: Promise
  return fetch(`/api/country/${code}/`, {
    method: "PUT",
    body: JSON.stringify(data as ICountry),
  });
};

export const deleteCurrency = async (code: string) => {
  // Delete currency by code
  // URL: /api/country/currency/:code
  // Method: DELETE
  // Params: code
  // Return: Promise
  return fetch(`/api/country/currency/${code}`, {
    method: "DELETE",
  });
};

export const postCurrency = async (data: ICurrency) => {
  // Create new currency
  // URL: /api/country/currency
  // Method: POST
  // Params: data
  // Return: Promise
  console.log("data", data);
  return fetch(`/api/country/currency/`, {
    method: "POST",
    body: JSON.stringify(data as ICurrency),
  });
};

export const putCurrency = async (code: string, data: ICurrency) => {
  // Update currency
  // URL: /api/country/currency/:code
  // Method: PUT
  // Params: data
  // Return: Promise
  return fetch(`/api/country/currency/${code}`, {
    method: "PUT",
    body: JSON.stringify(data as ICurrency),
  });
};

/**
 * Get all available app languages
 */
export const getLanguages = async () => {
  return fetch(`/api/country/language/`, {
    method: "GET",
  }).then((response) => response.json());
};
