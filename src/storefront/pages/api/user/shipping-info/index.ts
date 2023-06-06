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

export const userShippingInfoAPI = async (
    method: HTTPMETHOD,
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if (req && res) {
        setRequestResponse(req, res);
    }

    let url = `/country/storefront/address/shipping/`;

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
        case "PUT":
            return await api
                .put(url, body)
                .then((response) => response.data)
                .then((data) => {
                    return data;
                })
                .catch((error: any) => {
                    throw error;
                });
        case "DELETE":
            return await api
                .delete(url)
                .then((response) => response.data)
                .then((data) => {
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
    /**
     * This is a wrapper for the cart shipping info API in the backend
     */
    const { method } = req;

    if (method == "GET") {
        return userShippingInfoAPI("GET", req, res)
            .then((data) => res.status(200).json(data))
            .catch((error) => res.status(400).json(null));
    } else if (method == "PUT") {
        return userShippingInfoAPI("PUT", req, res)
            .then((data) => res.status(201).json(data))
            .catch((error) => res.status(400).json(null));
    } else if (method == "DELETE") {
        return userShippingInfoAPI("DELETE", req, res)
            .then((data) => res.status(200).json(data))
            .catch((error) => res.status(400).json(null));
    }

    return res.status(404).json({ message: "Method not supported" });
};

export default handler;
