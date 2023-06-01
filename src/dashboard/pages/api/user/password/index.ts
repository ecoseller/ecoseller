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
import { getCookie } from "cookies-next";

export const passwordUserAPI = async (
  method: HTTPMETHOD,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  switch (method) {
    case "PUT":
      const body = req?.body;
      const parsedBody = JSON.parse(body);

      if (!body) throw new Error("Body is empty");

      if (!parsedBody.selfEdit) {
        return await api
          .put(`/user/password/${parsedBody.email}`, body)
          .then((response) => response.data)
          .then((data) => {
            return data;
          })
          .catch((error: any) => {
            throw error;
          });
      } else {
        return await api
          .put(`/user/password`, body)
          .then((response) => response.data)
          .then((data) => {
            return data;
          })
          .catch((error: any) => {
            throw error;
          });
      }
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

  return passwordUserAPI(method as HTTPMETHOD, req, res)
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(400).json(null));
};

export default handler;
