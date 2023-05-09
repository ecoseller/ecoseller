// /api/cart/shipping-method/country/index.ts
// call the shipping method country api in the backend and return the data (list of shipping method countries for given ID)
import type { NextApiRequest, NextApiResponse } from "next";
import {
  api,
  setRequestResponse,
  backendApiHelper,
  cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { HTTPMETHOD } from "@/types/common";

export const shippingMethodCountryListAPI = async (
  method: HTTPMETHOD,
  id: number,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  const url = `/cart/dashboard/shipping/method/${id}/country/`;

  switch (method) {
    case "GET":
      return await api
        .get(url)
        .then((response) => response.data)
        .then((data) => {
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
   * This is a wrapper for the shipping method dashboard API in the backend
   */
  const { method } = req;

  const { id } = req.query;

  if (!id) throw new Error("ID is empty, cannot query shipping method");

  if (method == "GET") {
    return shippingMethodCountryListAPI("GET", Number(id), req, res)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  } else if (method == "POST") {
    return shippingMethodCountryListAPI("POST", Number(id), req, res)
      .then((data) => res.status(201).json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
