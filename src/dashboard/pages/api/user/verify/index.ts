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

export const userLoginVerifyAPI = async (
  method: HTTPMETHOD,
  token: string,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  switch (method) {
    case "POST":
      const body = { token };
      return await api
        .post("/user/refresh-token/verify/", body)
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
   * This is a wrapper for the cart api in the backend
   * It returns whole cart data from the backend
   */

  const { method, body } = req;
  const { token } = body;

  return userLoginVerifyAPI(method as HTTPMETHOD, token as string, req, res)
    .then((data) => res.status(201).json(data))
    .catch((error) => res.status(400).json(null));
};

export default handler;
