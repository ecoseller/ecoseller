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

export const orderDetailAPI = async (
  method: HTTPMETHOD,
  token: string,
  req?: NextApiRequest,
  res?: NextApiResponse,
  body?: any
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  const orderUrl = `/order/dashboard/${token}/`;

  switch (method) {
    case "GET":
      return await api.get(orderUrl).then((response) => response.data);
    case "PUT":
      return await api.put(orderUrl, body).then((response) => response.data);
    default:
      throw new Error("Method not supported");
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * This is a wrapper for the order API in the backend
   */

  // get the id from the query
  const { id } = req.query;
  // get body from the request
  const { body } = req;

  const { method } = req;

  if (method == "GET" || method == "PUT") {
    return orderDetailAPI(method, id?.toString() || "", req, res, body).then(
      (data) => res.status(200).json(data)
    );
  }
  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
