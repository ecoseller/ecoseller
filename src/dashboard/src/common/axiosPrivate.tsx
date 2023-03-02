// /common/axiosPrivate.js
import axios from "axios";
// Cookies
import Cookies from "js-cookie";

import { memoizedRefreshToken } from "./refreshToken";

axios.defaults.baseURL = "http://localhost:8000/";

axios.interceptors.request.use(
    async (config) => {
        console.log("axios.interceptors.request.use")
        const accessToken = Cookies.get("accessToken") || null;

        if (accessToken != null) {
            // @ts-expect-error - needed because of https://github.com/axios/axios/issues/5034
            config.headers = {
                ...config.headers,
                authorization: `JWT ${accessToken}`,
            };
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log("axios.interceptors.response.use")
        const config = error?.config;

        if (error?.response?.status === 401 && !config?.sent) {
            console.log("axios.interceptors.response.use 401")
            config.sent = true;

            const result = await memoizedRefreshToken();

            if (result?.accessToken) {
                config.headers = {
                    ...config.headers,
                    authorization: `JWT ${result?.accessToken}`,
                };
            }

            return axios(config);
        }
        return Promise.reject(error);
    }
);

export const axiosPrivate = axios;