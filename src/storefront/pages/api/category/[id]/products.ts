import type { NextApiRequest, NextApiResponse } from "next";
import { api, setRequestResponse } from "@/utils/interceptors/api";
import { HTTPMETHOD } from "@/types/common";
import { ISelectedFiltersWithOrdering } from "@/types/category";

export const categoryProductsAPI = async (
  method: HTTPMETHOD,
  id: string,
  country: string,
  pricelist: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  let url = `/category/storefront/${id}/products/?country=${country}&pricelist=${pricelist}`;
  switch (method) {
    case "GET":
      return await api.get(url).then((response) => response.data);
    case "POST":
      return await api
        .post(url, req.body)
        .then((response) => response.data as ISelectedFiltersWithOrdering);
    default:
      throw new Error("Method not supported");
  }
};

/**
 * This is a wrapper for the category detail API
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { id, country, pricelist } = req.query;

  if (method == "GET" || method == "POST") {
    return categoryProductsAPI(
      method,
      id?.toString() || "",
      country?.toString() || "",
      pricelist?.toString() || "",
      req,
      res
    )
      .then((data) => res.json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
