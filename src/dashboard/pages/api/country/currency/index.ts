import type { NextApiRequest, NextApiResponse } from "next";
import {
  api,
  setRequestResponse,
  backendApiHelper,
  cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { ICountry } from "@/types/country";
import { HTTPMETHOD } from "@/types/common";
import { ICurrency } from "@/types/localization";

export const currencyListAPI = async (
  method: HTTPMETHOD,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  switch (method) {
    case "GET":
      return await api
        .get("/country/currency/")
        .then((response) => response.data)
        .then((data: ICurrency[]) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "POST":
      const data = req.body;
      console.log("currencyApi", data);

      if (!data) {
        throw new Error("Data is required");
      }
      return await api
        .post("/country/currency/", data)
        .then((response) => response.data)
        .then((data: ICurrency) => {
          return data;
        })
        .catch((error: any) => {
          console.log("currencyApi", error?.data);
          throw error;
        });
    default:
      throw new Error("Method not supported");
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * This is a wrapper for the cart api in the backend
   * It returns whole cart data from the backend
   */
  // get the cart data from the backend
  if (req.method === "GET") {
    return currencyListAPI(req.method, req, res)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  } else if (req.method === "POST") {
    return currencyListAPI(req.method, req, res)
      .then((data) => res.status(201).json(data))
      .catch((error) => res.status(400).json(null));
  } else {
    return res.status(400).json({ error: "Method not supported" });
  }
};

export default handler;
