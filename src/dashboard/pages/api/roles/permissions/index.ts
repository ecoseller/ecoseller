// /api/cart/index.ts
// call the cart api in the backend
import type { NextApiRequest, NextApiResponse } from "next";
import {
  api,
  setRequestResponse,
  backendApiHelper,
  cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { IPermission, IUser } from "@/types/user";
import { HTTPMETHOD } from "@/types/common";

export const permissionsAPI = async (
  method: HTTPMETHOD,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }
  console.log("req?.method", req?.method);
  switch (method) {
    case "GET":
      return await api
        .get("/roles/permissions")
        .then((response) => response.data)
        .then((data: IPermission[]) => {
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

  const { method } = req;

  return permissionsAPI(method as HTTPMETHOD, req, res)
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(400).json(null));
};

export default handler;
