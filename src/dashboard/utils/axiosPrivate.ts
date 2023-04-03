// /common/axiosPrivate.js
import axios from "axios";
// Cookies
// @ts-ignore
import Cookies from "js-cookie";

import { memoizedRefreshToken } from "../src/common/refreshToken";

axios.defaults.baseURL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL; //"http://backend:8000";

console.log("axios.defaults.baseURL", axios.defaults.baseURL);

axios.interceptors.request.use(
  async (config) => {
    console.log("axios.interceptors.request.use");
    const accessToken = Cookies.get("accessToken") || null;
    config.withCredentials = true;

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
    console.log("axios.interceptors.response.use");
    const config = error?.config;

    if (error?.request?.status === 401 && !config?.sent) {
      console.log("axios.interceptors.response.use 401");
      config.sent = true;

      const result = await memoizedRefreshToken();

      if (result?.accessToken) {
        config.headers = {
          ...config.headers,
          authorization: `JWT ${result?.accessToken}`,
        };

        return axios(config);
      }
    }
    return Promise.reject(error);
  }
);

export const axiosPrivate = axios;
