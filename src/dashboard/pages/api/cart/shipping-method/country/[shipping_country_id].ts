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

export const shippingMethodCountryDetailAPI = async (
  method: HTTPMETHOD,
  shipping_country_id: number,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  const url = `/cart/dashboard/shipping/method/country/${shipping_country_id}/`;

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
    case "PUT":
      const body = req?.body;
      if (!body) throw new Error("Body is empty");
      return await api
        .put(url, body)
        .then((response) => response.data)
        .then((data) => {
          return data;
        })
        .catch((error: any) => {
          console.log("error", error?.response?.data);
          throw error;
        });
    case "DELETE":
      return await api
        .delete(url)
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

  const { shipping_country_id } = req.query;

  const { method } = req;
  if (method == "GET") {
    return shippingMethodCountryDetailAPI(
      "GET",
      Number(shipping_country_id),
      req,
      res
    )
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  } else if (method == "PUT") {
    return shippingMethodCountryDetailAPI(
      "PUT",
      Number(shipping_country_id),
      req,
      res
    )
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(error));
  } else if (method == "DELETE") {
    return shippingMethodCountryDetailAPI(
      "DELETE",
      Number(shipping_country_id),
      req,
      res
    )
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
