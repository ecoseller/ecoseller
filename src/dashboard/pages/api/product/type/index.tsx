// /api/country/index.ts
// call the country api in the backend and return the data (list of countries)
import type { NextApiRequest, NextApiResponse } from "next";
import {
  api,
  setRequestResponse,
  backendApiHelper,
  cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { ICountry } from "@/types/country";
import { HTTPMETHOD } from "@/types/common";

export const productTypeListAPI = async (
  method: HTTPMETHOD,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  switch (method) {
    case "GET":
      console.log("productTypeListAPI");
      return await api
        .get(`/product/dashboard/type/`)
        .then((response) => response.data)
        .then((data) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "POST":
      console.log("productTypeListAPI");
      const body = req?.body;
      if (!body) throw new Error("Body is empty");
      return await api
        .post(`/product/dashboard/type/`, body)
        .then((response) => response.data)
        .then((data) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    default:
      throw new Error("Method not supported");
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * This is a wrapper for the product type API in the backend
   */
  const { method } = req;
  if (method == "GET") {
    return productTypeListAPI("GET", req, res)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  } else if (method == "POST") {
    return productTypeListAPI("POST", req, res)
      .then((data) => res.status(201).json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
