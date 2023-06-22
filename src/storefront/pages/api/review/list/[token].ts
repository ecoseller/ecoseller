// /api/cart/[token]/product.ts
// call the cart product api in the backend and modify the cart product
import type { NextApiRequest, NextApiResponse } from "next";
import { api, setRequestResponse } from "@/utils/interceptors/api";
import { HTTPMETHOD } from "@/types/common";

export const productReviewListAPI = async (
    id: string,
    country: string,
    method: HTTPMETHOD,
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if (req && res) {
        setRequestResponse(req, res);
    }

    let url = `/review/storefront/${id}/${country}`;


    if (method === "GET") {
        return await api
            .get(url)
            .then((response) => response.data)
            .catch((error: any) => {
                throw error;
            });
    } else {
        throw new Error("Method not supported");
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    /**
     * This is a wrapper for the cart product API in the backend
     */
    const { method } = req;
    const { id } = req.query;
    const { country } = req.query;

    if (method == "POST") {
        return productReviewListAPI(id as string, country as string, "POST", req, res)
            .then((data) => res.status(204).json(null))
            .catch((error) => res.status(400));
    }

    return res.status(404).json({ message: "Method not supported" });
};

export default handler;
