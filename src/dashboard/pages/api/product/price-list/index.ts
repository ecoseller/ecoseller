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
import { IPriceList } from "@/types/localization";

export const pricelistListAPI = async (
  method: HTTPMETHOD,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }
  const url = "/product/dashboard/pricelist/";

  switch (method) {
    case "GET":
      return await api
        .get(url)
        .then((response) => response.data)
        .then((data: IPriceList[]) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "POST":
      const body = req?.body;
      if (!body) throw new Error("Body is empty");
      return await api
        .post(url, body)
        .then((response) => response.data)
        .then((data: IPriceList[]) => {
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
   * This is a wrapper for the pricelist list api in the backend
   */
  // get the cart data from the backend
  const method = req.method as HTTPMETHOD;

  if (method === "POST") {
    return pricelistListAPI("POST", req, res)
      .then((data) => res.status(201).json(data))
      .catch((error) => res.status(400).json(null));
  } else if (method === "GET") {
    return pricelistListAPI("GET", req, res)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(400).json({ message: "Method not supported" });
};

export default handler;
