import type { NextApiRequest, NextApiResponse } from "next";
import { api, setRequestResponse } from "@/utils/interceptors/api";

export const categoryProductsAPI = async (
  id: string,
  country: string,
  pricelist: string,
  req: NextApiRequest,
  res: NextApiResponse,
  sortBy?: string,
  order?: string
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  let url = `/category/storefront/${id}/products?country=${country}&pricelist=${pricelist}`;

  if (sortBy) {
    url += `&sort_by=${sortBy}`;
  }
  if (order) {
    url += `&order=${order}`;
  }

  return await api.get(url).then((response) => response.data);
};

/**
 * This is a wrapper for the category detail API
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { id, country, pricelist, sort_by, order } = req.query;

  if (method == "GET") {
    return categoryProductsAPI(
      id?.toString() || "",
      country?.toString() || "",
      pricelist?.toString() || "",
      req,
      res,
      sort_by?.toString(),
      order?.toString()
    )
      .then((data) => res.json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
