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

const categoryUrl = "/category/dashboard/"

export const categoryAPI = async (
  method: HTTPMETHOD,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  switch (method) {
    case "GET":
      return await api
        .get(categoryUrl)
        .then((response) => response.data);
    case "POST":
      const body = req?.body;
      if (!body) throw new Error("Body is empty");
      return await api
        .post(categoryUrl, body)
        .then((response) => response.data)
    default:
      throw new Error("Method not supported");
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * This is a wrapper for the category API in the backend
   */
  const { method } = req;
  if (method == "GET") {
    return categoryAPI("GET", req, res)
      .then((data) => res.status(200).json(data));
  } else if (method == "POST") {
    return categoryAPI("POST", req, res)
      .then((data) => res.status(201).json(data));
  }
  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
