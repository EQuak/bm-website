import type { DBClient } from "@repo/db/client"
import { TRPCError } from "@trpc/server"

import {
  getProfileByProfileId,
  getProfileByUserId
} from "../funcs/profiles.funcs"
import { parseDevImpersonationCookie } from "../utils/impersonation-cookie"

type AssertOrgOpts = {
  /** Platform staff may access any org (impersonation + internal tools). */
  isPlatformStaff?: boolean
  /** Request `Cookie` header — used with `dev_impersonation` (profile swap). */
  cookieHeader?: string | null
}

/**
 * When the dev impersonation cookie targets a profile in `organizationId`, allow
 * org-scoped procedures even if the real auth user has no row in that org (and
 * even when `isPlatformStaff` is false because app_metadata was not loaded).
 */
async function impersonationGrantsOrganizationAccess(
  db: DBClient,
  userId: string,
  organizationId: string,
  cookieHeader: string | null | undefined
): Promise<boolean> {
  const parsed = parseDevImpersonationCookie(cookieHeader)
  if (!parsed || parsed.realUserId !== userId) return false

  const impersonated = await getProfileByProfileId(db, {
    id: parsed.impersonatedProfileId
  })
  return impersonated?.organizationId === organizationId
}

/**
 * Ensures the authenticated user has a profile in the given organization.
 * Use at the start of every tenant-scoped profiles procedure.
 */
export async function assertUserInOrganization(
  db: DBClient,
  userId: string,
  organizationId: string,
  opts?: AssertOrgOpts
) {
  if (opts?.isPlatformStaff) {
    return
  }

  if (
    await impersonationGrantsOrganizationAccess(
      db,
      userId,
      organizationId,
      opts?.cookieHeader
    )
  ) {
    return
  }

  const profile = await getProfileByUserId(db, {
    userId,
    organizationId
  })
  if (!profile) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not a member of this organization."
    })
  }
  return profile
}
