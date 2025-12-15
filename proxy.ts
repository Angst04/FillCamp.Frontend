import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Middleware runs server-side, so use localhost to call Next.js API routes in the same container
  // This prevents SSL errors when the request origin is HTTPS but we're inside Docker
  const port = process.env.PORT || 3000;
  const isLoggedInUrl = `http://localhost:${port}/api/isLoggedIn`;

  const checkNumberResponse = await fetch(isLoggedInUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: request.headers.get("cookie") || ""
    },
    next: { revalidate: 300 }
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
