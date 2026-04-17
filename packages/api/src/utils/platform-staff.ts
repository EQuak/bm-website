import { isActivelyImpersonating } from "./impersonation-cookie"

/**
 * Platform staff can use internal tools (impersonation, cross-org reads) without
 * relying on tenant ACL roles. Set in Supabase Dashboard → Authentication → Users
 * → your user → App Metadata: `{ "platform_staff": true }`.
 *
 * Optional: `PLATFORM_STAFF_USER_IDS` (comma-separated UUIDs) for local/dev when
 * you cannot edit app_metadata yet.
 */
export function isPlatformStaffUser(
  userId: string,
  appMetadata: Record<string, unknown> | null | undefined
): boolean {
  const fromMetadata = appMetadata?.platform_staff
  if (fromMetadata === true || fromMetadata === "true") {
    return true
  }
  const raw = process.env.PLATFORM_STAFF_USER_IDS
  if (!raw?.trim()) return false
  const allowlist = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
  return allowlist.includes(userId)
}

/**
 * Platform nav, `/platform/*` layout, and `platformProcedure` should use this instead of
 * raw `ctx.user.isPlatformStaff` so that an active dev impersonation session does not
 * retain internal staff UI or APIs while viewing as another user.
 */
export function isEffectivePlatformStaff(ctx: {
  user: { id: string; isPlatformStaff: boolean }
  headers: Headers
}): boolean {
  if (!ctx.user.isPlatformStaff) return false
  const cookieHeader = ctx.headers.get("cookie")
  if (isActivelyImpersonating(cookieHeader, ctx.user.id)) return false
  return true
}
