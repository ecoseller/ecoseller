// /api/cart/[token]/product.ts
// call the cart product api in the backend and modify the cart product
import type { NextApiRequest, NextApiResponse } from "next";
import {
  api,
  setRequestResponse,
  backendApiHelper,
  cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { HTTPMETHOD } from "@/types/common";

export const cartProductAPI = async (
  method: HTTPMETHOD,
  token: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  let url = `/cart/storefront/${token}/`;

  const { body } = req;

  switch (method) {
    case "POST":
      return await api
        .post(url, body)
        .then((response) => response.data)
        .then((data) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "PUT":
      return await api
        .put(`${url}update-quantity/`, body)
        .then((response) => response.data)
        .then((data) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    // case "DELETE":
    //   return await api
    //     .delete(url)
    //     .then((response) => response.data)
    //     .then((data) => {
    //       return data;
    //     })
    //     .catch((error: any) => {
    //       throw error;
    //     });
    default:
      throw new Error("Method not supported");
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * This is a wrapper for the cart product API in the backend
   */
  const { method } = req;
  const { token } = req.query;

  const { body } = req;

  if (method == "POST") {
    return cartProductAPI("POST", token as string, req, res)
      .then((data) => res.status(201).json(data))
      .catch((error) => res.status(400).json(null));
  } else if (method == "PUT") {
    return cartProductAPI("PUT", token as string, req, res)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
    //   } else if (method == "DELETE") {
    //     return cartProductAPI("DELETE", token as string, req, res)
    //       .then((data) => res.status(200).json(data))
    //       .catch((error) => res.status(400).json(null));
  }

  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
