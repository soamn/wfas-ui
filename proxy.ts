import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { config as cfg } from "./app/config/config";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("connect.sid");
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    const targetUrl = new URL(request.url);
    return NextResponse.rewrite(
      `${cfg.BACKEND_SERVER_URL}${pathname}${targetUrl.search}`,
    );
  }

  const isPublicRoute = ["/login", "/register", "/"].includes(pathname);

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
