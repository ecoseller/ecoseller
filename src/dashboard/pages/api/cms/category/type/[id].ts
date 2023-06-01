import type { NextApiRequest, NextApiResponse } from "next";
import {
  api,
  setRequestResponse,
  backendApiHelper,
  cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { ICountry } from "@/types/country";
import { HTTPMETHOD } from "@/types/common";
import { ICurrency } from "@/types/localization";
import { IPageCategoryType } from "@/types/cms";

export const cmsCategoryTypeDetailAPI = async (
  method: HTTPMETHOD,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  const { id } = req.query;
  const url = `/cms/category/type/${id}`;
  switch (method) {
    case "GET":
      return await api
        .get(url)
        .then((response) => response.data)
        .then((data: IPageCategoryType) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "DELETE":
      return await api
        .delete(url)
        .then((response) => response.data)
        .then((data: IPageCategoryType) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "PUT":
      const data = req.body;

      if (!data) {
        throw new Error("Data is required");
      }
      return await api
        .put(url, data)
        .then((response) => response.data)
        .then((data: IPageCategoryType) => {
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
  // get the cart data from the backend
  if (req.method === "PUT" || req.method === "GET" || req.method === "DELETE") {
    return cmsCategoryTypeDetailAPI(req.method, req, res)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  } else {
    return res.status(400).json({ error: "Method not supported" });
  }
};

export default handler;
