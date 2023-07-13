import type { NextApiRequest, NextApiResponse } from "next";
import {
  api,
  setRequestResponse,
  backendApiHelper,
  cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { HTTPMETHOD } from "@/types/common";

export const orderComplaintAPI = async (
  method: HTTPMETHOD,
  id: string,
  req?: NextApiRequest,
  res?: NextApiResponse,
  body?: any
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  const orderUrl = `/order/dashboard/complaint/${id}/`;

  switch (method) {
    case "PUT":
      return await api.put(orderUrl, body).then((response) => response.data);
    default:
      throw new Error("Method not supported");
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * This is a wrapper for the order complaint API
   */

  // get the id from the query
  const { id } = req.query;
  // get body from the request
  const { body } = req;

  const { method } = req;

  if (method == "PUT") {
    return orderComplaintAPI(method, id?.toString() || "", req, res, body).then(
      (data) => res.status(200).json(data)
    );
  }
  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
