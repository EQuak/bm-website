import type { DBClient } from "../client"

/** Default org slug; must match seeded row. */
export const DEFAULT_ORGANIZATION_SLUG = "default" as const

/**
 * Stable id for the default org — must match seed / migrations.
 * Use when you cannot query (e.g. migrations) or to avoid an extra round-trip.
 */
export const DEFAULT_ORGANIZATION_ID =
  "00000000-0000-4000-8000-000000000001" as const

/** Internal / platform staff workspace (slug `internal`). Seed + migrations. */
export const INTERNAL_ORGANIZATION_SLUG = "internal" as const

export const INTERNAL_ORGANIZATION_ID =
  "00000000-0000-4000-8000-000000000002" as const

export async function getDefaultOrganizationId(db: DBClient): Promise<string> {
  const org = await db.query.OrganizationsTable.findFirst({
    columns: { id: true },
    where: (o, { eq: eqCol }) => eqCol(o.slug, DEFAULT_ORGANIZATION_SLUG)
  })
  if (!org) {
    throw new Error(
      'Default organization not found. Run migrations and ensure slug "default" exists.'
    )
  }
  return org.id
}
