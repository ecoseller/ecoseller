import type { NextApiRequest, NextApiResponse } from "next";
import { getCookie, deleteCookie, setCookie } from "cookies-next";
import Cookies from "js-cookie";
import axios, { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import Router from "next/router";
import jwt_decode from "jwt-decode";

const isServer = () => {
  return typeof window === "undefined";
};

// let accessToken = "";
let req = <NextApiRequest>{};
let res = <NextApiResponse>{};
const baseURL = process.env.API_URL! || process.env.NEXT_PUBLIC_API_URL!;

export const setAccessToken = (_accessToken: string) => {
  // accessToken = _accessToken;
};

const COOKIE_NAMES = {
  LOCALE: "NEXT_LOCALE",
  ACCESS_TOKEN: "accessToken",
} as const;

export const getAccessToken = () =>
  getCookie(COOKIE_NAMES.ACCESS_TOKEN, { req, res });

export const getLocale = () => getCookie(COOKIE_NAMES.LOCALE, { req, res });

export const setRequestResponse = (
  _req: NextApiRequest,
  _res: NextApiResponse
) => {
  req = _req;
  res = _res;
};

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // to send cookie
});

api.interceptors.request.use((config) => {
  let accessToken = getAccessToken();

  let access = "";
  if (isServer()) {
    access = getCookie(COOKIE_NAMES.ACCESS_TOKEN, { req, res }) as string;
  } else {
    access = Cookies.get(COOKIE_NAMES.ACCESS_TOKEN) || "";
  }
  if (!accessToken) {
    setAccessToken(access);
  }
  if (accessToken) {
    config.headers.Authorization = `JWT ${accessToken}`;
  }

  // set locale (if present)
  const locale = getLocale();
  if (locale) {
    config.headers["Accept-Language"] = locale;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // check conditions to refresh token
    if (
      error.response?.status === 401 &&
      !error.response?.config?.url?.includes("user/refresh-token") &&
      !error.response?.config?.url?.includes("user/login")
    ) {
      return refreshToken(error);
    }
    return Promise.reject(error);
  }
);

let fetchingToken = false;
let subscribers: ((token: string) => any)[] = [];

const onAccessTokenFetched = (token: string) => {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
};

const addSubscriber = (callback: (token: string) => any) => {
  subscribers.push(callback);
};

const refreshToken = async (oError: AxiosError) => {
  try {
    const { response } = oError;

    // create new Promise to retry original request
    const retryOriginalRequest = new Promise((resolve) => {
      addSubscriber((token: string) => {
        response!.config.headers["Authorization"] = `JWT ${token}`;
        resolve(axios(response!.config));
      });
    });

    // check whether refreshing token or not
    if (!fetchingToken) {
      fetchingToken = true;
      // refresh token
      const { data } = await api.post("/user/refresh-token", {
        refresh: getCookie("refreshToken", { req: req, res: res }),
      });

      const { access } = data || null;
      if (access) {
        setCookie("accessToken", access, {
          req: req,
          res: res,
          expires: new Date((jwt_decode(access) as any).exp * 1000),
        });
      }

      // check if this is server or not. We don't wanna save response token on server.
      if (!isServer) {
        setAccessToken(access);
      }
      // when new token arrives, retry old requests
      onAccessTokenFetched(access);
    }
    return retryOriginalRequest;
  } catch (error) {
    // on error go to login page
    // if (!isServer() && !Router.asPath.includes("/login")) {
    // 	Router.push("/login");
    // }
    // if (isServer()) {
    // 	res.setHeader("location", "/login");
    // 	res.statusCode = 302;
    // 	res.end();
    // }
    return Promise.reject(oError);
  } finally {
    fetchingToken = false;
  }
};

export const cartApiUrlHelper = (
  url: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // helper function to creaate the url for backend cart api
  // this is used in pages/api/cart/index.ts
  // it basically either uses the cart_session cookie or the access token
  // access token is preferred over cart_session
  // if there is no access token, then we use the cart_session cookie

  //   const cart_session = getCookie("cart_session", { req, res });
  const access_token = getCookie("accessToken", { req, res });

  if (access_token) {
    return url;
  }
  //   if (cart_session) {
  //     return `${url}?cart_session=${cart_session}`;
  //   }
  return url;
};

export const backendApiHelper = (req: NextApiRequest, res: NextApiResponse) => {
  // handle locale as well!

  let headers: any = {
    "Content-Type": "application/json",
    // ...req.headers,
  };

  const access_token = getCookie("accessToken", { req, res });
  if (access_token) {
    headers["Authorization"] = `JWT ${access_token}`;
  }
  return headers;
};
