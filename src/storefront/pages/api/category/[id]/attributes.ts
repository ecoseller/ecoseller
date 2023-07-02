import type { NextApiRequest, NextApiResponse } from "next";
import { api, setRequestResponse } from "@/utils/interceptors/api";
import { IAttributeSet } from "@/types/category";

export const categoryAttributesAPI = async (
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  let url = `/category/storefront/${id}/attributes/`;

  const data = await api
    .get(url)
    .then((response) => response.data as IAttributeSet);
  console.log(JSON.stringify(data));
  return data;
};

/**
 * This is a wrapper for the category attributes API
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { id } = req.query;

  if (method == "GET") {
    return categoryAttributesAPI(id?.toString() || "", req, res)
      .then((data) => res.json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
