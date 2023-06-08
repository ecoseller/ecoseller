// /api/cart/[token]/shipping-info.ts
// call the cart shipping info api in the backend and modify the cart shipping info
import type { NextApiRequest, NextApiResponse } from "next";
import {
    api,
    setRequestResponse,
    backendApiHelper,
    cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { HTTPMETHOD } from "@/types/common";

export const userOrdersAPI = async (
    method: HTTPMETHOD,
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if (req && res) {
        setRequestResponse(req, res);
    }

    let url = `/order/storefront/orders/`;

    const { body } = req;

    console.log("body", body);

    switch (method) {
        case "GET":
            return await api
                .get(url)
                .then((response) => response.data)
                .then((data) => {
                    return data;
                })
                .catch((error: any) => {
                    throw error;
                });
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    /**
     * This is a wrapper for the cart shipping info API in the backend
     */
    const { method } = req;

    if (method == "GET") {
        return userOrdersAPI("GET", req, res)
            .then((data) => res.status(200).json(data))
            .catch((error) => res.status(400).json(null));
    }

    return res.status(404).json({ message: "Method not supported" });
};

export default handler;
