import { NextRequest, NextResponse } from "next/server";

const PUBLIC = ["/maintenance", "/api/maintenance", "/_next", "/images", "/fonts", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const cookie = request.cookies.get("nakama-preview");
  if (cookie?.value === "granted") return NextResponse.next();

  return NextResponse.redirect(new URL("/maintenance", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
