/**
 * Purpose of this middleware is to control access to the dashboard.
 * If the user is not logged in, it will redirect to the login page.
 * * Not beeing logged in can be checked based on the refreshToken cookie - if it's not present, the user is not logged in.
 * * If cookie is present, we need to check if it's valid - if it's not, we need to redirect to login page. (via backend call to /user/refresh-token/verify/)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { userLoginVerifyAPI } from "./pages/api/user/verify";
import { NextApiRequest, NextApiResponse } from "next";
import { api } from "./utils/interceptors/api";

const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

const redirectToLogin = (request: NextRequest): NextResponse => {
  return NextResponse.redirect(new URL("/login", request.url));
};

// const verifyRefreshToken = async (refreshToken: string) => {
//   const body = { token: refreshToken };
//   return await fetch("/api/user/verify", {
//     method: "POST",
//     body: JSON.stringify(body),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       return data;
//     })
//     .catch((error: any) => {
//       throw error;
//     });
// };

export function middleware(request: NextRequest, response: NextResponse) {
  // read the refreshToken cookie
  if (!request.cookies.has(REFRESH_TOKEN_COOKIE_NAME))
    return redirectToLogin(request);

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  console.log("REFRESH TOKEN", refreshToken);
  if (!refreshToken) return redirectToLogin(request);

  //   // verify the refreshToken
  //   verifyRefreshToken(refreshToken)
  //     .then((data) => {
  //       console.log("DATA", data);
  //       if (!data) return redirectToLogin(request);
  //     })
  //     .catch((error) => {
  //       console.log("ERROR", error);
  //       return redirectToLogin(request);
  //     });

  return NextResponse.next();
}

// It's applied only on protected paths of /dashboard/*
export const config = {
  matcher: "/dashboard/:path*",
};
