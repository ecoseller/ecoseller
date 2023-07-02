import type { NextApiRequest, NextApiResponse } from "next";
import { api, setRequestResponse } from "@/utils/interceptors/api";
import { IAttributeSet, ISelectedFiters } from "@/types/category";

export const categoryFilterProductsAPI = async (
  id: string,
  country: string,
  pricelist: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  const url = `/category/storefront/${id}/filter/?country=${country}&pricelist=${pricelist}`;

  return await api
    .post(url, req.body)
    .then((response) => response.data as ISelectedFiters);
};

/**
 * This is a wrapper for the category attributes API
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { id, country, pricelist } = req.query;

  if (method == "POST") {
    return categoryFilterProductsAPI(
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
