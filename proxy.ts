import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Don't redirect if already on login page
  if (pathname === "/login") {
    return NextResponse.next();
  }

  const checkNumberResponse = await fetch(`${url.origin}/api/isLoggedIn`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    next: { revalidate: 0 }
  });
  const checkNumberData = await checkNumberResponse.json();

  if (checkNumberData.isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  } else {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page - handled separately)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)"
  ]
};
