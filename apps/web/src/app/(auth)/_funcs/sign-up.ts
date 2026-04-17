"use server"

import { createProfile, ProfileCreationError } from "@repo/api/funcs"
import { db } from "@repo/db/client"
import type { ProfileInsert } from "@repo/db/schema"

import { createSBServer } from "#/utils/supabase/server"

function resolveAppUrl(): string {
  const publicUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "")
  if (publicUrl) {
    return publicUrl
  }
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    return vercel.startsWith("http")
      ? vercel.replace(/\/$/, "")
      : `https://${vercel}`
  }
  return "http://localhost:3000"
}

function selfServiceProfile(): Omit<
  ProfileInsert,
  "preferences" | "organizationId"
> {
  return {
    inactive: false,
    firstName: "User",
    lastName: "Account",
    phone: "",
    avatar: "",
    aclRole: "user",
    aclCustomPermissions: []
  }
}

export async function signUp({
  email,
  password,
  companyName
}: {
  email: string
  password: string
  companyName: string
}) {
  const trimmedEmail = email.trim()

  try {
    await createProfile(db, {
      email: trimmedEmail,
      password,
      profile: selfServiceProfile(),
      newOrganization: { name: companyName.trim() },
      appUrl: resolveAppUrl(),
      sendEmail: false
    })
  } catch (error) {
    if (error instanceof ProfileCreationError) {
      if (error.step === "User existence check") {
        throw new Error("An account with this email already exists")
      }
      if (error.step === "Company name") {
        const details = error.details as { message?: string } | null
        throw new Error(details?.message ?? "Invalid company name")
      }
      if (error.step === "Creating auth user") {
        const details = error.details as { message?: string } | null
        if (details?.message) {
          throw new Error(details.message)
        }
      }
    }
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    )
  }

  const supabase = await createSBServer()
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password
  })

  if (signInError) {
    console.error("Sign-in after sign-up failed:", signInError)
    throw new Error(
      "Your account was created but sign-in failed. Try logging in manually."
    )
  }

  return data.user
}
