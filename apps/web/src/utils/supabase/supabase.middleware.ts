import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        }
      }
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const authClaims = await supabase.auth.getClaims()
  const user = authClaims.data?.claims

  const pathname = request.nextUrl.pathname
  const url = request.nextUrl.clone()

  // If has no user:
  if (!user) {
    // If is on protected route, redirect to login
    // Protected routes: /app/*
    if (pathname.startsWith("/app")) {
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
    // Else do nothing
    return supabaseResponse
  }

  // If has user:
  // get user preferences
  const preferences = user?.app_metadata?.preferences

  // Authenticated users on home: send to app. Do NOT redirect /login → /app here:
  // the workspace layout redirects to /login when there is no profile row; bouncing
  // /login → /app would loop forever for "session but no profile" users.
  if (pathname === "/") {
    url.pathname = "/app"
    return NextResponse.redirect(url)
  }

  // If the route is beta and the user is not a beta user, redirect to home
  const isBetaUser = preferences?.app?.beta_features ?? false

  // if (!isBetaUser && pathname.includes("/beta_")) {
  //   url.pathname = "/app"
  //   console.log("User not allowed to access beta features")
  //   return NextResponse.redirect(url)
  // }
  // Else do nothing
  return supabaseResponse
}
