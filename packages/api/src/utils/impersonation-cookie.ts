/**
 * Dev-only profile impersonation: cookie `dev_impersonation=<realUserId>:<profileId>`.
 * Parsed on the server from the `Cookie` header (same format as client `js-cookie`).
 */

const IMPERSONATION_COOKIE_RE = /dev_impersonation=([^;]+)/

export type ParsedDevImpersonation = {
  realUserId: string
  impersonatedProfileId: string
}

export function parseDevImpersonationCookie(
  cookieHeader: string | null | undefined
): ParsedDevImpersonation | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(IMPERSONATION_COOKIE_RE)
  if (!match) return null
  const raw = decodeURIComponent(match[1] ?? "")
  const [realUserId, impersonatedProfileId] = raw.split(":")
  if (!realUserId?.trim() || !impersonatedProfileId?.trim()) return null
  return { realUserId, impersonatedProfileId }
}

/**
 * True when this request carries a valid impersonation cookie for the given auth user.
 * While impersonating, platform-only UI and APIs should behave as the impersonated user
 * (no platform staff powers).
 */
export function isActivelyImpersonating(
  cookieHeader: string | null | undefined,
  authenticatedUserId: string
): boolean {
  const parsed = parseDevImpersonationCookie(cookieHeader)
  return parsed !== null && parsed.realUserId === authenticatedUserId
}
