import type { NextApiRequest, NextApiResponse } from "next";
import { api, setRequestResponse } from "@/utils/interceptors/api";

export const searchProductsAPI = async (
  query: string,
  country: string,
  pricelist: string,
  locale: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  const url = `search/storefront/product/${locale}/${query}?country=${country}&pricelist=${pricelist}`;

  console.log(url);

  return await api.get(url).then((response) => response.data);
};

/**
 * This is a wrapper for the category detail API
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { query, country, pricelist, locale } = req.query;

  if (method == "GET") {
    return searchProductsAPI(
      query?.toString() || "",
      country?.toString() || "",
      pricelist?.toString() || "",
      locale?.toString() || "",
      req,
      res
    )
      .then((data) => res.json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
