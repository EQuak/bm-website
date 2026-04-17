import type { EmailOtpType } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

import { createSBServer } from "#/utils/supabase/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const next = searchParams.get("next") ?? "/"

  if (token_hash && type) {
    const supabase = await createSBServer()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash
    })

    if (error) {
      console.error("Error in confirm route:", error)
      redirect("/auth/error?error=" + error.message)
    }
  }

  if (type === "recovery" && !searchParams.get("next")) {
    redirect("/reset-password")
  }

  if (next) {
    redirect(next)
  }
}
