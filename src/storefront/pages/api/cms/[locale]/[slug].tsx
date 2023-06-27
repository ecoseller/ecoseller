import type { NextApiRequest, NextApiResponse } from "next";
import { api, setRequestResponse } from "@/utils/interceptors/api";
import { HTTPMETHOD } from "@/types/common";

export const orderSubmitAPI = async (
  method: HTTPMETHOD,
  identifier: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  let url = `cms/storefront/category/type/${identifier}/pages/`;

  if (method === "GET") {
    return await api.get(url).then((response) => response.data);
  } else {
    throw new Error("Method not supported");
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * This is a wrapper for the CMS API in the backend to list all the categories and their pages for the footer menu.
   */
  const { method, query } = req;
  const { identifier } = query;

  if (method == "GET") {
    return orderSubmitAPI("GET", identifier as string, req, res)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(error.response.data));
  }
  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
