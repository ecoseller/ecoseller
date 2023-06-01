import type { NextApiRequest, NextApiResponse } from "next";
import {
  api,
  setRequestResponse,
  backendApiHelper,
  cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { ICountry } from "@/types/country";
import { HTTPMETHOD } from "@/types/common";
import { IAttributeType } from "@/types/product";

export const productAttributeTypeAPI = async (
  method: HTTPMETHOD,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  const url = `/product/dashboard/attribute/type/`;

  switch (method) {
    case "GET":
      return await api
        .get(url)
        .then((response) => response.data)
        .then((data: IAttributeType[]) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "POST":
      const body = req?.body;
      if (!body) {
        throw new Error("Body is empty");
      }

      return await api
        .post(url, body)
        .then((response) => response.data)
        .then((data: IAttributeType) => {
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
  if (req.method === "GET") {
    return productAttributeTypeAPI("GET", req, res)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  } else if (req.method === "POST") {
    return productAttributeTypeAPI("POST", req, res)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  } else {
    return res.status(400).json({ error: "Method not supported" });
  }
};

export default handler;
