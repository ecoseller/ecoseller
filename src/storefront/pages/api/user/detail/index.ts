// /api/cart/index.ts
// call the cart api in the backend
import type { NextApiRequest, NextApiResponse } from "next";
import {
    api,
    setRequestResponse,
    backendApiHelper,
    cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { IUser } from "@/types/user";
import { HTTPMETHOD } from "@/types/common";

export const userDetailAPI = async (
    method: HTTPMETHOD,
    req: NextApiRequest,
    res?: NextApiResponse
) => {
    if (req && res) {
        setRequestResponse(req, res);
    }

    const { body } = req;
    let url = `/user/detail`;


    switch (method) {
        case "GET":
            return await api
                .get(url)
                .then((response) => response.data)
                .then((data: IUser) => {
                    return data;
                })
                .catch((error: any) => {
                    throw error;
                });
        case "PUT":
            return await api
                .put(url, body)
                .then((response) => response.data)
                .then((data: IUser) => {
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
     * This is a wrapper for the cart api in the backend
     * It returns whole cart data from the backend
     */

    const { method } = req;

    return userDetailAPI(method as HTTPMETHOD, req, res)
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(400).json(null));
};

export default handler;
