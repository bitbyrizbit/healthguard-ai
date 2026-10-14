import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that don't need authentication checking
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/login" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  try {
    // Fetch session from Better Auth API
    // We do this via fetch because Edge runtime cannot use the Node.js pg driver in auth.ts
    const sessionRes = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    let user = null;
    if (sessionRes.ok) {
      try {
        const sessionData = await sessionRes.json();
        user = sessionData?.user;
      } catch (err) {
        user = null;
      }
    }

    // Check if the user is authenticated for protected routes (e.g., admin portal)
    if (!user) {
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return NextResponse.next();
    }

    // Role-based Access Control
    const role = user.role || "guest";

    if (pathname.startsWith("/admin") && role !== "admin") {
      // Unauthorized access to admin panel
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Auth Error:", error);
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
