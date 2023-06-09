import { ICountry } from "@/types/country";

export const getCountries = async () => {
  // Get country list
  // URL: /api/country/
  // Method: GET
  // Params: token
  // Return: Promise
  return fetch(`/api/country/`)
    .then((res) => res.json())
    .then((data) => data as ICountry[]);
};

export const getCountry = async (code: string) => {
  // Get country detail
  // URL: /api/country/<code>/
  // Method: GET
  // Params: token
  // Return: Promise
  return fetch(`/api/country/${code}/`)
    .then((res) => res.json())
    .then((data) => data as ICountry);
};
