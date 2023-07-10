import type { NextApiRequest, NextApiResponse } from "next";
import { api, setRequestResponse } from "@/utils/interceptors/api";
import { HTTPMETHOD } from "@/types/common";

export const orderComplaintAPI = async (
  method: HTTPMETHOD,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  let url = `/order/storefront/complaint/`;

  if (method === "POST") {
    return api.post(url, req.body).then((response) => response.data);
  } else {
    throw new Error("Method not supported");
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method == "POST") {
    return orderComplaintAPI("POST", req, res)
      .then((data) => res.status(201).json(data))
      .catch((error) => res.status(400));
  }

  return res.status(404).json({ message: "Method not supported" });
};

export default handler;
