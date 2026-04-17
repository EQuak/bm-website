import type { AdminUserAttributes } from "@supabase/supabase-js"
import { createClient } from "@supabase/supabase-js"

/** Order must match `DEFAULT_PROFILES` in `profiles_seed.ts` for the first N entries. */
export const USERS_UUID_TYPE = [
  { email: "developer@developer.com" },
  { email: "user@user.com" },
  { email: "admin@admin.com" }
]

export async function createAuthUsers() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl?.includes("127.0.0.1")) {
    console.log("error: enviroment not allowed to seed")
    process.exit(1)
  }
  const supabase = createClient(
    supabaseUrl,
    supabaseServiceRoleKey!
  )

  const users = await generateSupabaseAuthUsers()

  const newUsers = await Promise.all(
    users.map((user) => {
      return supabase.auth.admin.createUser(user)
    })
  )

  // console.log(newUsers)
  const authUsers = newUsers.map((user) => user.data.user).filter((u) => !!u)

  return authUsers
}

async function generateSupabaseAuthUsers(pass = "123456") {
  return USERS_UUID_TYPE.map((user) => {
    const { email } = user

    return {
      role: "authenticated",
      email: email,
      password: pass,
      email_confirm: true,
      user_metadata: {},
      app_metadata:
        email === "developer@developer.com"
          ? { platform_staff: true }
          : {}
    } satisfies AdminUserAttributes
  })
}
