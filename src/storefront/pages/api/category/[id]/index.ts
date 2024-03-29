import type { NextApiRequest, NextApiResponse } from "next";
import { api, setRequestResponse } from "@/utils/interceptors/api";

export const categoryDetailAPI = async (
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  const url = `/category/storefront/${id}/`;

  return await api.get(url).then((response) => response.data);
};

/**
 * This is a wrapper for the category detail API
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { id } = req.query;

  if (method == "GET") {
    return categoryDetailAPI(id?.toString() || "", req, res)
      .then((data) => res.json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
