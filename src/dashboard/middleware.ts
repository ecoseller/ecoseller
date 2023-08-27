/**
 * Purpose of this middleware is to control access to the dashboard.
 * If the user is not logged in, it will redirect to the login page.
 * * Not beeing logged in can be checked based on the refreshToken cookie - if it's not present, the user is not logged in.
 */

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
// JWT
import jwt_decode from "jwt-decode";

const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

const redirectToLogin = (request: NextRequest): NextResponse => {
  return NextResponse.redirect(new URL("/login", request.url));
};

export function middleware(request: NextRequest, response: NextResponse) {
  // read the refreshToken cookie
  if (!request.cookies.has(REFRESH_TOKEN_COOKIE_NAME))
    return redirectToLogin(request);

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  if (!refreshToken) return redirectToLogin(request);

  // verify the refreshToken
  const refreshTokenDecoded: any = jwt_decode(refreshToken);
  // redirect to login if refreshToken doesnt have dashboard_login flag
  if (refreshTokenDecoded.dashboard_user !== true)
    return redirectToLogin(request);
  // redirect to login if refreshToken is expired
  if (refreshTokenDecoded.exp < Date.now() / 1000)
    return redirectToLogin(request);

  return NextResponse.next();
}

// It's applied only on protected paths of /dashboard/*
export const config = {
  matcher: "/dashboard/:path*",
};
