import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const checkNumberResponse = await fetch(`${url.origin}/api/isLoggedIn`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: request.headers.get("cookie") || ""
    },
    next: { revalidate: 86400 }
  });
  const checkNumberData = await checkNumberResponse.json();

  // If user is logged in
  if (checkNumberData.isLoggedIn) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } else {
    // If user is not logged in
    if (pathname === "/login") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ]
};
