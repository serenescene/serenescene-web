import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "serene_scene_practice_token";

/** Re-issue practice auth at site root so /practice/subscribe and legacy paths see the session. */
export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export const config = {
  matcher: ["/practice/:path*"],
};
