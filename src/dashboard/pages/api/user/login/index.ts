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

export const userLoginAPI = async (
  method: HTTPMETHOD,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  switch (method) {
    case "POST":
      const body = req?.body;
      console.log("BODY", body);
      if (!body) throw new Error("Body is empty");

      return await api
        .post("/user/login", body)
        .then((response) => response.data)
        .then((data) => {
          return data;
        })
        .catch((error: any) => {
          console.log("ERROR", error.response.data.error);
          if (error.response.data.error) {
            throw error.response.data.error;
          }
          throw "Error during login occured. Please check your backend service.";
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

  const { method } = req;

  return userLoginAPI(method as HTTPMETHOD, req, res)
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(400).json({ error: error }));
};

export default handler;
