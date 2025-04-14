// export { auth as middleware } from "@/auth"

import { auth } from "@/auth"
import { NextResponse, NextRequest } from "next/server"

// List of public paths that don't require authentication
const publicPaths = ["/login", "/api/auth/*"]

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicPath = publicPaths.some((path) => {
    if (path.endsWith("*")) {
      return pathname.startsWith(path.slice(0, -1))
    }
    return pathname === path
  })

  const session = await auth()

  // If trying to access protected path without token
  if (!isPublicPath && !session) {
    // Redirect to login page
    const loginUrl = new URL("/login", request.url)
    // Add the original path to redirect back after login
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If trying to access login page while already authenticated
  if (pathname === "/login" && session) {
    // Redirect to home page or the page they were trying to access before login
    const from = request.nextUrl.searchParams.get("from") || "/dashboard"
    return NextResponse.redirect(new URL(from, request.url))
  }

  //   return NextResponse.redirect(new URL("/home", request.url))
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
