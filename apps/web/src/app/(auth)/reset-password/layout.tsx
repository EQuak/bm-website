import { redirect } from "next/navigation"
import { createSBServer } from "#/utils/supabase/server"

export default async function ForgotPasswordLayout({
  children
}: {
  children: React.ReactNode
}) {
  const supabase = await createSBServer()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    redirect("/login?reason=not-logged-in")
  }
  return <>{children}</>
}
