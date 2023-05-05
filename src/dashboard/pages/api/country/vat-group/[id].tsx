// /api/country/index.ts
// call the country api in the backend and return the data (list of countries)
import type { NextApiRequest, NextApiResponse } from "next";
import {
  api,
  setRequestResponse,
  backendApiHelper,
  cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { IVatGroup } from "@/types/country";
import { HTTPMETHOD } from "@/types/common";

export const vatGroupDetailAPI = async (
  method: HTTPMETHOD,
  id: number,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  const url = `/country/vat-group/${id}/`;

  switch (method) {
    case "GET":
      return await api
        .get(url)
        .then((response) => response.data)
        .then((data: IVatGroup) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "PUT":
      const body = req?.body;
      if (!body) {
        throw new Error("Body is missing");
      }
      return await api
        .put(url, body)
        .then((response) => response.data)
        .then((data: IVatGroup) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "DELETE":
      return await api
        .delete(url)
        .then((response) => response.data)
        .then((data: any) => {
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
   * This is a wrapper for vat group detail API
   * it allows to POST/GET data from the backend
   */

  const { method } = req;
  const { id } = req.query;

  if (method === "GET" || method === "PUT" || method === "DELETE") {
    return vatGroupDetailAPI(method, Number(id), req, res)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(400).json({ error: "Method not supported" });
};

export default handler;
