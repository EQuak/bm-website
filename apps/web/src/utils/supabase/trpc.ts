import { createSBAdminServer, createSBServer } from "./server"

export async function createSupabaseTRPCClient() {
  const supabase = await createSBServer()

  const authClaims = await supabase.auth.getClaims()
  const user = authClaims.data?.claims

  return {
    user: user ? {
      ...user,
      id: user.sub
    } : null,
    supabase
  }
}

export async function createSupabaseAdminTRPCClient() {
  const supabase = createSBAdminServer()

  return {
    supabase
  }
}
