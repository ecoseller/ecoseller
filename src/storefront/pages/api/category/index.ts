// /api/category/tree
// call the cart api in the backend
import type { NextApiRequest, NextApiResponse } from "next";
import { api } from "@/utils/api";

export const categoryAPI = async (
  req: NextApiRequest,
  res: NextApiResponse,
  locale: string
) => {
  return await api
    .get(`/category/storefront/`, {
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
   * This is a wrapper for the slider api in the backend
   * It returns whole slider data from the backend for given locale
   */
  // get query parameter `locale`
  const { locale } = req.query;
  const language = Array.isArray(locale) ? locale[0] : locale || "en";

  return categoryAPI(req, res, language)
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(400).json(null));
};

export default handler;
