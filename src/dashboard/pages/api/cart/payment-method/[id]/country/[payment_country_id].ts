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

export const paymentMethodCountryDetailAPI = async (
  method: HTTPMETHOD,
  id: number,
  payment_country_id: number,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  if (!id) throw new Error("Provide ID");

  const url = `/cart/dashboard/payment/method/${id}/country/${payment_country_id}/`;

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
        .delete(url, body)
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
   * This is a wrapper for the payment method dashboard API in the backend
   */

  const { id, payment_country_id } = req.query;

  const { method } = req;
  if (method == "GET") {
    return paymentMethodCountryDetailAPI(
      "GET",
      Number(id),
      Number(payment_country_id),
      req,
      res
    )
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  } else if (method == "PUT") {
    return paymentMethodCountryDetailAPI(
      "PUT",
      Number(id),
      Number(payment_country_id),
      req,
      res
    )
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(error));
  } else if (method == "DELETE") {
    return paymentMethodCountryDetailAPI(
      "DELETE",
      Number(id),
      Number(payment_country_id),
      req,
      res
    )
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
