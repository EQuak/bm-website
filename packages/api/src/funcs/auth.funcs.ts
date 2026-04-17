import { and, eq, sql } from "@repo/db"
import type { DBClient } from "@repo/db/client"
import { DEFAULT_ORGANIZATION_ID } from "@repo/db/default-organization"
import { ProfilesTable } from "@repo/db/schema"

import type { SupabaseClient } from "@supabase/supabase-js"
import { createSBAdminServer } from "../utils/supabase/server"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require("bcryptjs")

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function assertValidEmail(email: string): string {
  const trimmed = email.trim()
  if (!trimmed || !EMAIL_PATTERN.test(trimmed)) {
    throw new Error("Enter a valid email address")
  }
  return trimmed
}

/**
 * Initiates the password reset process for the given email.
 *
 * Usage:
 * await forgotPassword(supabase, { email: 'user@example.com' });
 *
 * If a redirectTo URL is provided, the user will be redirected to that page after resetting their password.
 */
export async function forgotPassword(
  supabase: SupabaseClient,
  {
    email,
    redirectTo
  }: {
    email: string
    redirectTo?: string
  }
) {
  try {
    const normalizedEmail = assertValidEmail(email)
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo: redirectTo
      }
    )
    if (error) {
      throw new Error(JSON.stringify(error))
    }
    return data
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    )
  }
}

/**
 * Deactivates a user's account and sends a notification email.
 *
 * This function performs the following actions:
 * 1. Updates the user's auth status in Supabase (email unconfirmed and optionally banned)
 * 2. Sets the user's profile to inactive in the database
 * 3. Retrieves the user's details
 * 4. Sends a deactivation notification email to the user
 *
 * @param db - Database client for querying and modifying the database
 * @param userId - The ID of the user to deactivate
 * @param alsoBan - Optional flag to also ban the user (default: false)
 * @param reason - Optional reason for deactivation to include in the email
 * @param notifyUser - Optional flag to send a notification email (default: true)
 *
 * @throws Error if unable to update user in Supabase or if user details are not found
 */
export const inactiveUser = async (
  db: DBClient,
  {
    userId,
    alsoBan = false,
    reason: _reason,
    notifyUser = true
  }: {
    userId: string
    alsoBan?: boolean
    reason?: string
    notifyUser?: boolean
  }
) => {
  const supabaseAdmin = await createSBAdminServer()

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    email_confirm: false,
    ban_duration: alsoBan ? `${365 * 24 * 60 * 60}s` : "none"
  })

  if (error) {
    throw new Error(error.message)
  }

  await db
    .update(ProfilesTable)
    .set({ inactive: true })
    .where(
      and(
        eq(ProfilesTable.userId, userId),
        eq(ProfilesTable.organizationId, DEFAULT_ORGANIZATION_ID)
      )
    )

  const profile = await db.query.ProfilesTable.findFirst({
    columns: {
      firstName: true,
      lastName: true
    },
    with: {
      user: {
        columns: {
          email: true
        }
      }
    },
    where: (Profiles, { eq, and: andWhere }) =>
      andWhere(
        eq(Profiles.userId, userId),
        eq(Profiles.organizationId, DEFAULT_ORGANIZATION_ID)
      )
  })

  if (!profile?.user?.email) {
    throw new Error("User details not found")
  }

  if (!notifyUser) {
    return
  }

  // await sendDeactivatedUserEmail({
  //   email: profile.user.email,
  //   firstName: profile.firstName,
  //   lastName: profile.lastName,
  //   deactivationDateTime: new Date().toISOString(),
  //   reason
  // })
}

/**
 * Reactivates a user's account and sends a notification email.
 *
 * This function performs the following actions:
 * 1. Reactivates the user's auth status in Supabase (email confirmed and ban removed)
 * 2. Sets the user's profile to active in the database
 * 3. Retrieves the user's details
 * 4. Sends a reactivation notification email to the user
 *
 * @param db - Database client for querying and modifying the database
 * @param userId - The ID of the user to reactivate
 * @param appUrl - The base URL of the application (used for login link in email)
 * @param notifyUser - Optional flag to send a notification email (default: true)
 *
 * @returns The email address of the reactivated user
 * @throws Error if unable to update user in Supabase or if user details are not found
 */
export const reactivateUser = async (
  db: DBClient,
  {
    userId,
    appUrl,
    notifyUser = true
  }: {
    userId: string
    appUrl: string
    notifyUser?: boolean
  }
) => {
  const supabaseAdmin = await createSBAdminServer()

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    email_confirm: true,
    ban_duration: "none"
  })

  if (error) {
    throw new Error(error.message)
  }

  await db
    .update(ProfilesTable)
    .set({ inactive: false })
    .where(
      and(
        eq(ProfilesTable.userId, userId),
        eq(ProfilesTable.organizationId, DEFAULT_ORGANIZATION_ID)
      )
    )

  const profile = await db.query.ProfilesTable.findFirst({
    columns: {
      firstName: true,
      lastName: true
    },
    with: {
      user: {
        columns: {
          email: true
        }
      }
    },
    where: (Profiles, { eq, and: andWhere }) =>
      andWhere(
        eq(Profiles.userId, userId),
        eq(Profiles.organizationId, DEFAULT_ORGANIZATION_ID)
      )
  })

  if (!profile?.user?.email) {
    throw new Error("User details not found")
  }

  if (!notifyUser) {
    return
  }

  // await sendReactivatedUserEmail({
  //   email: profile.user.email,
  //   firstName: profile.firstName,
  //   lastName: profile.lastName,
  //   reactivationDateTime: new Date().toISOString(),
  //   loginUrl: `${appUrl}/login`
  // })
  return profile.user.email
}

export const checkUserPassword = async (
  db: DBClient,
  { userId, password }: { userId: string; password: string }
) => {
  const user = await db.query.UsersTable.findFirst({
    columns: {
      encryptedPassword: true
    },
    where: (Users, { eq }) => eq(Users.id, userId)
  })

  if (!user?.encryptedPassword) {
    throw new Error("User not found")
  }

  return bcrypt.compare(password, user.encryptedPassword)
}

export const updateUserPassword = async (
  db: DBClient,
  supabase: SupabaseClient,
  {
    userId,
    newPassword,
    currentPassword
  }: { userId: string; newPassword: string; currentPassword: string }
) => {
  const isPasswordCorrect = await checkUserPassword(db, {
    userId,
    password: currentPassword
  })

  if (!isPasswordCorrect) {
    throw new Error("Current password is incorrect")
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    throw new Error(error.message)
  }

  return data.user
}

export const adminUpdateUserEmail = async (
  db: DBClient,
  supabaseAdmin: SupabaseClient,
  { userId, newEmail }: { userId: string; newEmail: string }
) => {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      email: newEmail
    }
  )
  await db.execute(sql`DELETE FROM auth.sessions WHERE user_id = ${userId}`)

  if (error) {
    throw new Error(error.message)
  }

  return data.user
}

export const adminUpdateUserPassword = async (
  _db: DBClient,
  supabaseAdmin: SupabaseClient,
  { userId, newPassword }: { userId: string; newPassword: string }
) => {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      password: newPassword
    }
  )

  if (error) {
    throw new Error(error.message)
  }

  return data.user
}
