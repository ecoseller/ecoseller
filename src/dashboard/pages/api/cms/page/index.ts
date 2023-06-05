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
import { IPageCMS, IPageFrontend } from "@/types/cms";

export const cmsPageListAPI = async (
  method: HTTPMETHOD,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  const url = `/cms/`;

  switch (method) {
    case "GET":
      return await api
        .get(url)
        .then((response) => response.data)
        .then((data: IPageFrontend[] | IPageCMS[]) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "POST":
      const data = req.body;

      if (!data) {
        throw new Error("Data is required");
      }
      return await api
        .post(url, data)
        .then((response) => response.data)
        .then((data: IPageFrontend | IPageCMS) => {
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
   * This is a wrapper for the CMS "get all pages" list api in the backend
   */
  if (req.method === "GET") {
    return cmsPageListAPI(req.method, req, res)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  } else if (req.method === "POST") {
    return cmsPageListAPI(req.method, req, res)
      .then((data) => res.status(201).json(data))
      .catch((error) => res.status(400).json(null));
  } else {
    return res.status(400).json({ error: "Method not supported" });
  }
};

export default handler;
