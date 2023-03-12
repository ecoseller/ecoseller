// @/src/common/refreshToken.js
import { AxiosInstance } from "axios";
import mem from "mem";
import jwt_decode from "jwt-decode";

// Cookies
// @ts-ignore
import Cookies from "js-cookie";

import { axiosPublic } from "@/utils/axiosPublic";

const refreshTokenFn = async () => {
  const refreshToken = Cookies.get("refreshToken") || null;

  try {
    const response: any = await axiosPublic.post("/user/refresh-token", {
      refreshToken: refreshToken,
    });

    var { session } = response.data;

    if (!session?.accessToken) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    }

    Cookies.set("accessToken", session?.accessToken, {
      expires: new Date((jwt_decode(session?.accessToken) as any).exp * 1000),
    });

    return session;
  } catch (error) {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  }
};

const maxAge = 10000;

export const memoizedRefreshToken = mem(refreshTokenFn, {
  maxAge,
});
