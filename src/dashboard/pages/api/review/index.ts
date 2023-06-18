// /api/country/index.ts
// call the country api in the backend and return the data (list of countries)
import type { NextApiRequest, NextApiResponse } from "next";
import {
    api,
    setRequestResponse,
    backendApiHelper,
    cartApiUrlHelper,
} from "@/utils/interceptors/api";
import { ICountry } from "@/types/country";
import { HTTPMETHOD } from "@/types/common";

const reviewUrl = "/review/dashboard/";

export const reviewListAPI = async (
    method: HTTPMETHOD,
    req?: NextApiRequest,
    res?: NextApiResponse
) => {
    if (req && res) {
        setRequestResponse(req, res);
    }

    switch (method) {
        case "GET":
            return await api.get(reviewUrl).then((response) => response.data);
        default:
            throw new Error("Method not supported");
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    /**
     * This is a wrapper for the order API in the backend
     */
    const { method } = req;
    if (method == "GET") {
        return reviewListAPI("GET", req, res).then((data) => res.status(200).json(data));
    }
    return res.status(404).json({ message: "Method not supported" });
};

export default handler;
