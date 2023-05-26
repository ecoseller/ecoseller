// /api/category/tree
// call the cart api in the backend
import type { NextApiRequest, NextApiResponse } from "next";
import { api } from "@/utils/interceptors/api";

export const productAPI = async (
  id: number,
  req: NextApiRequest,
  res: NextApiResponse,
  locale: string
) => {
  return await api
    .get(`/product/storefront/${id}`, {
      headers: { "Accept-Language": locale },
    })
    .then((response: any) => response.data)
    .then((data: any) => {
      return data;
    })
    .catch((error: any) => {
      console.log("error", error);
      return null;
    });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * This is a wrapper for the product api in the backend
   * It returns product data from the backend for given locale
   */
  const { locale } = req.query;
  const { id } = req.query;

  let idNumber = Array.isArray(id) ? Number(id[0]) : Number(id) || null;

  if (!idNumber) {
    return res.status(400).json(null);
  }
  const language = Array.isArray(locale) ? locale[0] : locale || "en";

  return productAPI(idNumber, req, res, language)
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(400).json(null));
};

export default handler;
