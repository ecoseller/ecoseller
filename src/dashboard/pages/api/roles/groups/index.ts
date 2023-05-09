// /api/cart/index.ts
// call the cart api in the backend
import type { NextApiRequest, NextApiResponse } from "next";
import {
    api,
    setRequestResponse,
    backendApiHelper,
    cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { IGroup, IUser } from "@/types/user";
import { HTTPMETHOD } from "@/types/common";

export const groupsAPI = async (
    req?: NextApiRequest,
    res?: NextApiResponse
) => {
    if (req && res) {
        setRequestResponse(req, res);
    }

    switch (req?.method) {
        case "GET":
            return await api
                .get("/roles/groups")
                .then((response) => response.data)
                .then((data: IGroup[]) => {
                    return data;
                })
                .catch((error: any) => {
                    throw error;
                });
        case "POST":
            return await api
                .post("/roles/groups", req?.body)
                .then((response) => response.data)
                .then((data: Number) => {
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
    // get the cart data from the backend
    return groupsAPI(req, res)
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(400).json(null));
};

export default handler;
