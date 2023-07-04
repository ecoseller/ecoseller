import type { NextApiRequest, NextApiResponse } from "next";
import { api, setRequestResponse } from "@/utils/interceptors/api";
import { RS_EVENT } from "@/utils/context/recommender";

export const recommenderEventAPI = async (
  event: RS_EVENT,
  payload: { [key: string]: any },
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  const url = `recommender/storefront/${event}/`;

  console.log(url);

  return await api.post(url).then((response) => response.data);
};

/**
 * This is a wrapper for the category detail API
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;
  const { event } = req.query;

  if (method == "POST") {
    return recommenderEventAPI(event as RS_EVENT, body, req, res)
      .then((data) => res.json(data))
      .catch((error) => res.status(400).json(null));
  }
  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
