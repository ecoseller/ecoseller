// /api/category/tree
// call the cart api in the backend
import type { NextApiRequest, NextApiResponse } from "next";
import { api } from "@/utils/interceptors/api";

export const productAPI = async (
  id: number,
  country: string,
  pricelist: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  return await api
    .get(`/product/storefront/${id}?country=${country}&pricelist=${pricelist}`)
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
  const { id, country, pricelist } = req.query;

  let idNumber = Array.isArray(id) ? Number(id[0]) : Number(id) || null;

  if (!idNumber) {
    return res.status(400).json(null);
  }

  return productAPI(idNumber, country as string, pricelist as string, req, res)
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(400).json(null));
};

export default handler;
