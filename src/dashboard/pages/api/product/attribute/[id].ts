import type { NextApiRequest, NextApiResponse } from "next";
import { api, setRequestResponse } from "@/utils/interceptors/api";
import { HTTPMETHOD } from "@/types/common";
import { IAttributeType, IBaseAttribute } from "@/types/product";

export const productBaseAttributeDetailAPI = async (
  method: HTTPMETHOD,
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req && res) {
    setRequestResponse(req, res);
  }

  const url = `/product/dashboard/attribute/${id}/`;

  switch (method) {
    case "GET":
      return await api
        .get(url)
        .then((response) => response.data)
        .then((data: IBaseAttribute) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "DELETE":
      return await api
        .delete(url)
        .then((response) => response.data)
        .then((data: IBaseAttribute | null) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    case "PUT":
      const data = req.body;

      if (!data) {
        throw new Error("Data is required");
      }
      return await api
        .put(url, data)
        .then((response) => response.data)
        .then((data: IBaseAttribute) => {
          return data;
        })
        .catch((error: any) => {
          throw error;
        });
    default:
      throw new Error("Method not supported");
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method === "PUT" || req.method === "GET" || req.method === "DELETE") {
    return productBaseAttributeDetailAPI(req.method, id as string, req, res)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(400).json(null));
  } else {
    return res.status(400).json({ error: "Method not supported" });
  }
};

export default handler;
