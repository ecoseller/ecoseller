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

export const productTypeDetailAPI = async (
  method: HTTPMETHOD,
  id: number,
  req?: NextApiRequest,
  res?: NextApiResponse,
  body?: any
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  switch (method) {
    case "GET":
      return await api
        .get(`/product/dashboard/type/${id}/`)
        .then((response) => response.data)
        .then((data: ICountry[]) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "PUT":
      const body = req?.body;
      if (!body) throw new Error("Body is empty");
      return await api
        .put(`/product/dashboard/type/${id}/`, body)
        .then((response) => response.data)
        .then((data) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "DELETE":
      console.log("productTypeListAPI");
      return await api
        .delete(`/product/dashboard/type/${id}/`)
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
   * This is a wrapper for the product type detail api in the backend
   */

  // get the id from the query
  const { id } = req.query;
  // get body from the request
  const { body } = req;

  const { method } = req;
  if (method == "PUT" || method == "DELETE" || method == "GET") {
    return productTypeDetailAPI(method, Number(id), req, res, body)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(400).json({ message: "Method not supported" });
};

export default handler;
