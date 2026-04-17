"use server"

import { createSBServer } from "#/utils/supabase/server"

export async function resetPassword({ password }: { password: string }) {
  try {
    const supabase = await createSBServer()

    const {
      data: { user },
      error
    } = await supabase.auth.updateUser({
      password
    })

    if (error) {
      console.error("Error updating user:", error)
      throw new Error(error.message)
    }

    return user
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    )
  }
}
