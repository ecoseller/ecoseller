// /api/cart/[token]/billing-info.ts
// call the cart billing info api in the backend and modify the cart billing info
import type { NextApiRequest, NextApiResponse } from "next";
import {
  api,
  setRequestResponse,
  backendApiHelper,
  cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { HTTPMETHOD } from "@/types/common";

export const cartBillingInfoAPI = async (
  method: HTTPMETHOD,
  token: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  let url = `/cart/storefront/${token}/billing-info/`;

  const { body } = req;

  console.log("body", body);

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
      return await api
        .put(url, body)
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
   * This is a wrapper for the cart billing info API in the backend
   */
  const { method } = req;
  const { token } = req.query;

  const { body } = req;

  if (method == "GET") {
    return cartBillingInfoAPI("GET", token as string, req, res)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  } else if (method == "PUT") {
    return cartBillingInfoAPI("PUT", token as string, req, res)
      .then((data) => res.status(201).json(data))
      .catch((error) => res.status(400).json(null));
  }

  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
