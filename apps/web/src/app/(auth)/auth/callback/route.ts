import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { DEFAULT_LANDING_PATH } from "#/core/config/routes"
import { env } from "#/env"

function safeInternalPath(next: string | null, fallback: string): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback
  }
  return next
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = safeInternalPath(searchParams.get("next"), DEFAULT_LANDING_PATH)

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          }
        }
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  const err = searchParams.get("error_description") ?? "oauth_failed"
  const from = searchParams.get("from")
  const returnPath = from === "sign-up" ? "/sign-up" : "/login"
  return NextResponse.redirect(
    `${origin}${returnPath}?error=${encodeURIComponent(err)}`
  )
}
