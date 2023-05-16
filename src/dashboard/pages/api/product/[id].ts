// /api/cart/index.ts
// call the cart api in the backend
import type { NextApiRequest, NextApiResponse } from "next";
import {
  api,
  setRequestResponse,
  backendApiHelper,
  cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { IUser } from "@/types/user";
import { HTTPMETHOD } from "@/types/common";
import { IProduct } from "@/types/product";

export const productDetailAPI = async (
  method: HTTPMETHOD,
  id: number,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  const url = `/product/dashboard/detail/${id}`;

  switch (method) {
    case "GET":
      return await api
        .get(url)
        .then((response) => response.data)
        .then((data: IProduct) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "DELETE":
      return await api
        .delete(url)
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

  const { id } = req.query;
  const { method } = req;

  if (!id) return res.status(400).json({ message: "id is required" });
  if (Array.isArray(id) || isNaN(Number(id)))
    return res.status(400).json({ message: "id must be a number" });

  if (method === "GET" || method === "PUT" || method === "DELETE") {
    return productDetailAPI(method, Number(id), req, res)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  } else {
    return res.status(400).json({ message: "Method not supported" });
  }
};

export default handler;