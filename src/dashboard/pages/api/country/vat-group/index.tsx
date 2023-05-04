// /api/country/index.ts
// call the country api in the backend and return the data (list of countries)
import type { NextApiRequest, NextApiResponse } from "next";
import {
  api,
  setRequestResponse,
  backendApiHelper,
  cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { ICountry, IVatGroup } from "@/types/country";
import { HTTPMETHOD } from "@/types/common";

export const vatGroupAPI = async (
  method: HTTPMETHOD,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }
  const url = `/country/vat-group/`;

  switch (method) {
    case "GET":
      return await api
        .get(url)
        .then((response) => response.data)
        .then((data: IVatGroup[]) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "POST":
      const body = req?.body;
      if (!body) {
        throw new Error("Body is missing");
      }
      console.log("body", body);
      return await api
        .post(url, body)
        .then((response) => response.data)
        .then((data: IVatGroup) => {
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
   * This is a wrapper for vat group API
   * it allows to POST/GET data from the backend
   */

  const { method } = req;

  if (method === "GET" || method === "POST") {
    return vatGroupAPI(method, req, res)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(400).json({ error: "Method not supported" });
};

export default handler;
