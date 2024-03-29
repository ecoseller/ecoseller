import type { NextApiRequest, NextApiResponse } from "next";
import { api, setRequestResponse } from "@/utils/interceptors/api";
import { RS_RECOMMENDATIONS_SITUATIONS } from "@/utils/context/recommender";

export const recommenderProductsAPI = async (
  situation: RS_RECOMMENDATIONS_SITUATIONS,
  payload: { [key: string]: any },
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  // create query params from payload

  const params = new URLSearchParams(payload).toString();
  console.log("params", params);
  const url = `recommender/storefront/${situation}/products/?${params}`;
  console.log("payload", payload);
  console.log(url);

  return await api.get(url).then((response) => response.data);
};

/**
 * This is a wrapper for the category detail API
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;
  const { event, ...payload } = req.query;

  console.log("payload", payload, "event", event, "method", method);

  if (method == "GET") {
    return recommenderProductsAPI(
      event as RS_RECOMMENDATIONS_SITUATIONS,
      payload as { [key: string]: any },
      req,
      res
    )
      .then((data) => res.json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
