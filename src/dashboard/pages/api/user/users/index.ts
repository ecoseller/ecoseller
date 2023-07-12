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

export const usersAPI = async (
  method: HTTPMETHOD,
  page: number,
  pageSize: number,
  req?: NextApiRequest,
  res?: NextApiResponse,
  body?: any
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  let url = `/user/users/?page=${page + 1}&limit=${pageSize}`;

  switch (method) {
    case "GET":
      return await api
        .get(url)
        .then((response) => response.data)
        .then((data: IUser) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "POST":
      return await api
        .post("/user/users", body)
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

  const { method } = req;
  const { body } = req;
  const { page, pageSize } = req.query;

  return usersAPI(
    method as HTTPMETHOD,
    Number(page),
    Number(pageSize),
    req,
    res,
    body
  )
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(400).json(null));
};

export default handler;
