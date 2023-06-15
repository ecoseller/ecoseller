import type { NextApiRequest, NextApiResponse } from "next";
import { api, setRequestResponse } from "@/utils/interceptors/api";
import { HTTPMETHOD } from "@/types/common";

export const orderSubmitAPI = async (
  method: HTTPMETHOD,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  if (!req.body) throw new Error("No body found");

  let url = `/order/storefront/`;

  if (method === "POST") {
    return await api.post(url, req.body).then((response) => response.data);
    //   .catch((error: any) => error.response.data);
  } else {
    throw new Error("Method not supported");
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * This is a wrapper for the order API in the backend to submit an order
   */
  const { method } = req;

  if (method == "POST") {
    return orderSubmitAPI("POST", req, res)
      .then((data) => res.status(201).json(data))
      .catch((error) => res.status(400).json(error.response.data));
  }
  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
