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
import { IProductList, IProductListItem } from "@/types/product";

export const productListAPI = async (
  method: HTTPMETHOD,
  req: NextApiRequest,
  res: NextApiResponse,
  queryParams?: string
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }
  let url = `/product/dashboard/`;

  switch (method) {
    case "GET":
      if (queryParams) {
        url += `?${queryParams}`;
      }
      return await api
        .get(url)
        .then((response) => response.data)
        .then((data: IProductList[]) => {
          console.log("data", data);
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "POST":
      url += `detail/`;

      const body = req?.body;
      console.log("body", body);
      if (!body) throw new Error("Body is empty");

      return await api
        .post(url, body)
        .then((response) => response.data)
        .then((data: IProductListItem) => {
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
  const method = req.method as HTTPMETHOD;

  const queryParam = req.query;

  // convert queryParam to string
  const queryParamString = Object.keys(queryParam)
    .map((key) => {
      return `${key}=${queryParam[key]}`;
    })
    .join("&");

  console.log("queryParam", queryParam);

  if (method === "POST") {
    return productListAPI("POST", req, res)
      .then((data) => res.status(201).json(data))
      .catch((error) => res.status(400).json(null));
  } else if (method === "GET") {
    return productListAPI("GET", req, res, `?${queryParamString}`)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(400).json({ message: "Method not supported" });
};

export default handler;
