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

export const cartProductDeleteAPI = async (
  method: HTTPMETHOD,
  token: string,
  sku: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  let url = `/cart/storefront/${token}/${sku}/`;

  if (method === "DELETE") {
    return await api
      .delete(url)
      .then((response) => response.data)
      .catch((error: any) => {
        throw error;
      });
  } else {
    throw new Error("Method not supported");
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * This is a wrapper for the cart product API in the backend
   */
  const { method } = req;
  const { token, sku } = req.query;

  console.log(`token: ${token}, sku: ${sku}`);

  if (method == "DELETE") {
    return cartProductDeleteAPI(
      "DELETE",
      token as string,
      sku as string,
      req,
      res
    )
      .then((data) => console.log("204"))
      .catch((error) => res.status(400));
  }

  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
