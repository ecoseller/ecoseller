import type { NextApiRequest, NextApiResponse } from "next";
import { api, setRequestResponse } from "@/utils/interceptors/api";

export const categoryProductsAPI = async (
  id: string,
  country: string,
  pricelist: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  const url = `/category/storefront/${id}/products?country=${country}&pricelist=${pricelist}`;

  console.log(url);

  return await api.get(url).then((response) => response.data);
};

/**
 * This is a wrapper for the category detail API
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { id, country, pricelist } = req.query;

  if (method == "GET") {
    return categoryProductsAPI(
      id?.toString() || "",
      pricelist?.toString() || "",
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
