"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createSBServer } from "#/utils/supabase/server"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Authenticates a user with email and password.
 */
export async function login({
  credential,
  password
}: {
  credential: string
  password: string
}) {
  const email = credential.trim()
  if (!email) {
    return {
      data: null,
      error: "Email is required" as const
    }
  }
  if (!EMAIL_PATTERN.test(email)) {
    return {
      data: null,
      error: "Enter a valid email address" as const
    }
  }

  const supabase = await createSBServer()

  const {
    data: { user },
    error
  } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error ?? !user) {
    return {
      data: null,
      error: error?.message ?? ("Wrong credentials" as const)
    }
  }

  return {
    data: user,
    error: null
  }
}

/**
 * Logs out the current user and redirects them to the login page.
 */
export async function logout() {
  const supabase = await createSBServer()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}

export async function loginWithOneTimeCode({
  credential,
  oneTimeCode
}: {
  credential: string
  oneTimeCode: string
}) {
  const email = credential.trim()
  if (!EMAIL_PATTERN.test(email)) {
    return {
      data: null,
      error: "Enter a valid email address"
    }
  }

  const supabase = await createSBServer()
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: oneTimeCode,
    type: "email"
  })

  if (error) {
    return {
      data: null,
      error: error.message
    }
  }

  return {
    data: data,
    error: null
  }
}
