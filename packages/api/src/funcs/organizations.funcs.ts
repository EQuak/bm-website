import type { DBClient } from "@repo/db/client"

import { parseDevImpersonationCookie } from "../utils/impersonation-cookie"
import { getProfileByProfileId, getProfileByUserId } from "./profiles.funcs"

/**
 * Returns the organization id for a slug if the user has a profile in that org.
 */
export async function getOrganizationIdForMemberBySlug(
  db: DBClient,
  {
    userId,
    slug
  }: {
    userId: string
    slug: string
  }
): Promise<string | null> {
  const org = await db.query.OrganizationsTable.findFirst({
    columns: { id: true },
    where: (o, { eq: eqCol }) => eqCol(o.slug, slug)
  })
  if (!org?.id) return null

  const profile = await getProfileByUserId(db, {
    userId,
    organizationId: org.id
  })
  return profile ? org.id : null
}

export async function getOrganizationIdBySlug(
  db: DBClient,
  slug: string
): Promise<string | null> {
  const org = await db.query.OrganizationsTable.findFirst({
    columns: { id: true },
    where: (o, { eq: eqCol }) => eqCol(o.slug, slug)
  })
  return org?.id ?? null
}

/**
 * Resolve `/app/[org_slug]` → organization id for the signed-in user.
 * Normal members: only if they have a profile in that org.
 * Platform staff: any existing slug (impersonation + internal navigation).
 */
export async function resolveWorkspaceOrganizationId(
  db: DBClient,
  {
    userId,
    slug,
    isPlatformStaff,
    cookieHeader
  }: {
    userId: string
    slug: string
    isPlatformStaff: boolean
    cookieHeader?: string | null
  }
): Promise<string | null> {
  if (isPlatformStaff) {
    return getOrganizationIdBySlug(db, slug)
  }

  const parsed = parseDevImpersonationCookie(cookieHeader)
  if (parsed?.realUserId === userId && parsed.impersonatedProfileId) {
    const impersonated = await getProfileByProfileId(db, {
      id: parsed.impersonatedProfileId
    })
    if (impersonated) {
      const org = await db.query.OrganizationsTable.findFirst({
        columns: { id: true, slug: true },
        where: (o, { eq: eqCol }) => eqCol(o.slug, slug)
      })
      if (org?.id && org.id === impersonated.organizationId) {
        return org.id
      }
    }
  }

  return getOrganizationIdForMemberBySlug(db, { userId, slug })
}

/** All organizations (platform staff only). */
export async function listAllOrganizationsForPlatform(db: DBClient) {
  return db.query.OrganizationsTable.findMany({
    columns: {
      id: true,
      name: true,
      slug: true,
      inactive: true,
      createdAt: true,
      updatedAt: true
    },
    orderBy: (o, { asc: ascFn }) => ascFn(o.name)
  })
}
