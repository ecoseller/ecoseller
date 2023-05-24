// /api/cart/[token]/methods.ts
// call the cart api in the backend and return selected cart billing method based on the token
import type { NextApiRequest, NextApiResponse } from "next";
import {
  api,
  setRequestResponse,
  backendApiHelper,
  cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { HTTPMETHOD } from "@/types/common";

export const cartPaymentMethodAPI = async (
  method: HTTPMETHOD,
  token: string,
  id: string,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  const url = `/cart/storefront/${token}/payment-method/${id}/`;

  switch (method) {
    case "PUT":
      return await api
        .put(url)
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
  const { method } = req;
  const { token, id } = req.query;

  if (method == "PUT") {
    return cartPaymentMethodAPI("PUT", token as string, id as string, req, res)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
