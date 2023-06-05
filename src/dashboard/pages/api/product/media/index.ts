// /api/country/index.ts
// call the country api in the backend and return the data (list of countries)
import type { NextApiRequest, NextApiResponse } from "next";
import {
  api,
  setRequestResponse,
  backendApiHelper,
  cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { ICountry } from "@/types/country";
import { HTTPMETHOD } from "@/types/common";
import { IProductList, IProductListItem, IProductMedia } from "@/types/product";

export const productMediaListAPI = async (
  method: HTTPMETHOD,
  req: NextApiRequest,
  res: NextApiResponse,
  queryParams?: string
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }
  let url = `/product/dashboard/media/`;

  switch (method) {
    case "POST":
      const body = req?.body;
      if (!body) throw new Error("Body is empty");
      console.log("body", body);
      return await api
        .post(url, body)
        .then((response) => response.data)
        .then((data: IProductMedia) => {
          return data;
        })
        .catch((error: any) => {
          // print error message
          console.log("error", error?.response?.data);
          throw error;
        });
    default:
      throw new Error("Method not supported");
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method as HTTPMETHOD;

  if (method === "POST") {
    return productMediaListAPI("POST", req, res)
      .then((data) => res.status(201).json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(400).json({ message: "Method not supported" });
};

export default handler;
