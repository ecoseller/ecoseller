// /api/cart/index.ts
// call the cart api in the backend
import type { NextApiRequest, NextApiResponse } from "next";
import {
  api,
  setRequestResponse,
} from "@/utils/interceptors/api";
import { HTTPMETHOD } from "@/types/common";
import { IProduct } from "@/types/product";

export const productDetailAPI = async (
  method: HTTPMETHOD,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  const url = `/recommender/dashboard/recommender-system/config/`;

  switch (method) {
    case "PUT":
      const body = req?.body;
      if (!body) throw new Error("Body is empty");
      return await api
        .put(url, body)
        .then((response) => response.data)
        .then((data: IProduct) => {
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
   * This is a wrapper for the product detail api in the backend
   */

  const { method } = req;

  if (method === "PUT") {
    return productDetailAPI(method, req, res)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  } else {
    return res.status(400).json({ message: "Method not supported" });
  }
};

export default handler;
