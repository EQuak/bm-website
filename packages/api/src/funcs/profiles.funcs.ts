/**
 * This file is an extract of logical functions from routes/profiles to be easily used in any place.
 */

import {
  and,
  desc,
  eq,
  getTableColumns,
  ilike,
  isNotNull,
  isNull,
  or
} from "@repo/db"
import type { DBClient } from "@repo/db/client"
import { DEFAULT_ORGANIZATION_ID } from "@repo/db/default-organization"
import type { ProfileInsert, ProfileUpdate } from "@repo/db/schema"
import {
  AclsRolesTable,
  OrganizationsTable,
  ProfilesTable,
  UsersTable
} from "@repo/db/schema"
import type { SupabaseClient } from "@supabase/supabase-js"

import { createSBAdminServer } from "../utils/supabase/server"

export async function getAllProfiles(
  db: DBClient,
  { organizationId }: { organizationId: string }
) {
  return db.query.ProfilesTable.findMany({
    where: (Profiles, { eq }) => eq(Profiles.organizationId, organizationId),
    orderBy: (Profiles, { desc }) => desc(Profiles.createdAt),
    with: {
      user: {
        columns: {
          email: true
        }
      },
      _aclRole: true
    }
  })
}

/**
 * Profiles whose linked auth user has not confirmed their email yet (pending invite).
 */
export async function getPendingInviteProfiles(
  db: DBClient,
  { organizationId }: { organizationId: string }
) {
  return db
    .select({
      ...getTableColumns(ProfilesTable),
      email: UsersTable.email,
      invitedAt: UsersTable.invitedAt,
      roleName: AclsRolesTable.name
    })
    .from(ProfilesTable)
    .innerJoin(UsersTable, eq(ProfilesTable.userId, UsersTable.id))
    .leftJoin(AclsRolesTable, eq(ProfilesTable.aclRole, AclsRolesTable.slug))
    .where(
      and(
        eq(ProfilesTable.organizationId, organizationId),
        isNotNull(UsersTable.invitedAt),
        isNull(UsersTable.emailConfirmedAt)
      )
    )
    .orderBy(desc(ProfilesTable.createdAt))
}

export async function getAllProfilesAlphabetically(
  db: DBClient,
  { organizationId }: { organizationId: string }
) {
  return db.query.ProfilesTable.findMany({
    orderBy: (Profiles, { asc }) => asc(Profiles.fullName),
    where: (Profiles, { eq, and }) =>
      and(
        eq(Profiles.inactive, false),
        eq(Profiles.organizationId, organizationId)
      ),
    columns: {
      id: true,
      fullName: true
    },
    with: {
      _aclRole: {
        columns: {
          name: true
        }
      }
    }
  })
}

/**
 * All active profiles across organizations (platform staff only).
 * Used for impersonation picker and internal support views.
 */
export async function getAllProfilesAlphabeticallyForPlatform(db: DBClient) {
  return db.query.ProfilesTable.findMany({
    orderBy: (Profiles, { asc }) => asc(Profiles.fullName),
    where: (Profiles, { eq }) => eq(Profiles.inactive, false),
    columns: {
      id: true,
      fullName: true,
      organizationId: true
    },
    with: {
      _aclRole: {
        columns: {
          name: true,
          slug: true
        }
      },
      _organization: {
        columns: {
          name: true,
          slug: true
        }
      }
    }
  })
}

/**
 * All profiles across organizations for platform staff (includes inactive).
 */
export async function getMasterUserListForPlatform(db: DBClient) {
  return db.query.ProfilesTable.findMany({
    orderBy: (Profiles, { asc }) => asc(Profiles.fullName),
    columns: {
      id: true,
      fullName: true,
      organizationId: true,
      inactive: true,
      aclRole: true
    },
    with: {
      user: {
        columns: {
          email: true
        }
      },
      _aclRole: {
        columns: {
          name: true,
          slug: true
        }
      },
      _organization: {
        columns: {
          name: true,
          slug: true
        }
      }
    }
  })
}

export async function getProfilesWithSearchAndFiltersInfinite(
  db: DBClient,
  {
    searchText,
    roleSlug,
    limit,
    cursor,
    inactive,
    organizationId
  }: {
    searchText?: string
    roleSlug?: string
    limit?: number
    cursor?: number
    inactive?: boolean
    organizationId: string
  }
) {
  const employeesPerPage = limit ?? 10
  const offset = cursor ?? 0

  const employees = await db
    .select({
      ...getTableColumns(ProfilesTable),
      email: UsersTable.email,
      role: AclsRolesTable.name
    })
    .from(ProfilesTable)
    .leftJoin(UsersTable, eq(ProfilesTable.userId, UsersTable.id))
    .leftJoin(AclsRolesTable, eq(ProfilesTable.aclRole, AclsRolesTable.slug))
    .where(
      and(
        eq(ProfilesTable.organizationId, organizationId),
        searchText
          ? or(
              ilike(ProfilesTable.fullName, `%${searchText}%`),
              ilike(UsersTable.email, `%${searchText}%`),
              ilike(ProfilesTable.aclRole, `%${searchText}%`)
            )
          : undefined,
        roleSlug ? eq(ProfilesTable.aclRole, roleSlug) : undefined,
        inactive !== undefined
          ? eq(ProfilesTable.inactive, inactive)
          : undefined
      )
    )
    .groupBy(
      ProfilesTable.id,
      ProfilesTable.organizationId,
      ProfilesTable.inactive,
      ProfilesTable.userId,
      ProfilesTable.firstName,
      ProfilesTable.lastName,
      ProfilesTable.fullName,
      ProfilesTable.phone,
      ProfilesTable.avatar,
      ProfilesTable.aclCustomPermissions,
      ProfilesTable.preferences,
      ProfilesTable.createdAt,
      ProfilesTable.updatedAt,
      ProfilesTable.aclRole,
      UsersTable.email,
      AclsRolesTable.name
    )
    .orderBy(desc(ProfilesTable.createdAt))

  const totalCount = employees.length
  const paginatedResults = employees.slice(offset, offset + employeesPerPage)
  const hasNextPage = offset + employeesPerPage < totalCount

  return {
    employees: paginatedResults,
    nextCursor: hasNextPage ? offset + employeesPerPage : undefined,
    totalCount: totalCount
  }
}

export async function getAllProfilesByRoleSlug(
  db: DBClient,
  { roleSlug, organizationId }: { roleSlug: string; organizationId: string }
) {
  const profiles = await db
    .select({
      fullName: ProfilesTable.fullName,
      id: ProfilesTable.id
    })
    .from(ProfilesTable)
    .where(
      and(
        eq(ProfilesTable.aclRole, roleSlug),
        eq(ProfilesTable.organizationId, organizationId)
      )
    )
    .orderBy(desc(ProfilesTable.createdAt))

  return profiles
}

export async function getProfileById(
  db: DBClient,
  supabase: SupabaseClient,
  { id, organizationId }: { id: string; organizationId: string }
) {
  const profile = await db.query.ProfilesTable.findFirst({
    where: (Profiles, { eq, and }) =>
      and(eq(Profiles.id, id), eq(Profiles.organizationId, organizationId)),
    with: {
      user: {
        columns: {
          email: true
        }
      },
      _aclRole: {
        with: {
          _permissions: true
        }
      }
    }
  })

  return {
    ...profile
  }
}

/**
 * Loads a profile for a user scoped to one organization (multi-tenant row).
 */
export async function getProfileByUserId(
  db: DBClient,
  { userId, organizationId }: { userId: string; organizationId: string }
) {
  return db.query.ProfilesTable.findFirst({
    where: (Profiles, { eq, and }) =>
      and(
        eq(Profiles.userId, userId),
        eq(Profiles.organizationId, organizationId)
      ),
    orderBy: (Profiles, { desc }) => desc(Profiles.createdAt),
    with: {
      user: {
        columns: {
          email: true
        }
      },
      _organization: {
        columns: {
          id: true,
          slug: true,
          name: true
        }
      },
      _aclRole: {
        with: {
          _permissions: true
        }
      }
    }
  })
}

/**
 * Latest profile row for a user (any org). Used only for post-login redirect bootstrap.
 */
export async function getLatestUserProfile(db: DBClient, userId: string) {
  return db.query.ProfilesTable.findFirst({
    where: (Profiles, { eq }) => eq(Profiles.userId, userId),
    orderBy: (Profiles, { desc }) => desc(Profiles.createdAt),
    with: {
      user: {
        columns: {
          email: true
        }
      },
      _organization: {
        columns: {
          id: true,
          slug: true,
          name: true
        }
      },
      _aclRole: {
        with: {
          _permissions: true
        }
      }
    }
  })
}

export async function getProfileByProfileId(
  db: DBClient,
  { id }: { id: string }
) {
  return db.query.ProfilesTable.findFirst({
    where: (Profiles, { eq }) => eq(Profiles.id, id),
    with: {
      user: {
        columns: {
          email: true
        }
      },
      _organization: {
        columns: {
          id: true,
          slug: true,
          name: true
        }
      },
      _aclRole: {
        with: {
          _permissions: true
        }
      }
    }
  })
}

// Mutations

/**
 * Custom error class for profile creation errors.
 * Includes the step where the error occurred and any relevant details.
 */
export class ProfileCreationError extends Error {
  constructor(
    public step: string,
    public details: unknown
  ) {
    super(`Error during profile creation: ${step}`)
    this.name = "ProfileCreationError"
  }
}

function baseSlugFromCompanyName(name: string): string {
  const s = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
  return s.length > 0 ? s : "workspace"
}

async function generateUniqueOrganizationSlug(
  db: DBClient,
  companyName: string
): Promise<string> {
  const base = baseSlugFromCompanyName(companyName)
  let candidate = base
  let counter = 1
  while (counter < 10_000) {
    const existing = await db.query.OrganizationsTable.findFirst({
      columns: { id: true },
      where: (o, { eq }) => eq(o.slug, candidate)
    })
    if (!existing) return candidate
    candidate = `${base}-${counter}`
    counter++
  }
  throw new ProfileCreationError(
    "Creating organization",
    "Could not allocate a unique organization slug"
  )
}

/**
 * Creates a new user profile based on an invitation.
 *
 * This function performs the following steps:
 * 1. Validates the invitation and checks for existing users
 * 2. Creates a new auth user in Supabase
 * 3. Creates a new profile in the database
 * 4. Sets up ACL roles for the new user
 * 5. Marks the invitation as redeemed
 * 6. Sends a welcome email to the new user
 *
 * Error handling is implemented at each step to provide specific error messages
 * and to ensure data consistency in case of failures.
 *
 * @param db - Database client for querying and modifying the database
 * @param supabase - Supabase client for auth operations
 * @param invite - The invitation details
 * @param profile - The new user's profile information
 * @param password - The new user's password
 * @param appUrl - The base URL of the application for generating login links
 * @returns The ID of the newly created profile
 * @throws ProfileCreationError if any step in the process fails
 */
export async function createProfile(
  db: DBClient,
  {
    email,
    profile,
    password,
    appUrl,
    sendEmail,
    newOrganization
  }: {
    email: string
    profile: Omit<ProfileInsert, "preferences" | "organizationId"> & {
      organizationId?: string
    }
    password: string
    appUrl: string
    sendEmail: boolean
    /** When set, creates a new organization row and attaches the profile to it. */
    newOrganization?: { name: string }
  }
) {
  // Step 2: Check if the user already exists
  const existingUser = await db.query.UsersTable.findFirst({
    columns: { id: true },
    where: (u, { eq }) => eq(u.email, email)
  })

  if (existingUser) {
    throw new ProfileCreationError("User existence check", {
      user: existingUser
    })
  }

  let createdOrganizationId: string | null = null
  let organizationId: string

  if (newOrganization) {
    const name = newOrganization.name.trim()
    if (name.length < 2) {
      throw new ProfileCreationError("Company name", {
        message: "Company name must be at least 2 characters"
      })
    }
    if (name.length > 200) {
      throw new ProfileCreationError("Company name", {
        message: "Company name is too long"
      })
    }
    const slug = await generateUniqueOrganizationSlug(db, name)
    const [org] = await db
      .insert(OrganizationsTable)
      .values({
        name,
        slug,
        inactive: false
      })
      .returning({ id: OrganizationsTable.id })
    if (!org?.id) {
      throw new ProfileCreationError(
        "Creating organization",
        "Failed to create organization"
      )
    }
    createdOrganizationId = org.id
    organizationId = org.id
  } else {
    organizationId = profile.organizationId ?? DEFAULT_ORGANIZATION_ID
  }

  const profileRow = { ...profile }

  const supabaseAdmin = await createSBAdminServer()

  try {
    // Step 3: Create the auth user in Supabase
    // Only include phone if it's in E.164 format (starts with +)
    const createUserParams = {
      email: email,
      email_confirm: true,
      password,
      app_metadata: { aclRole: profileRow.aclRole },
      user_metadata: { ...profileRow },
      ...(profileRow.phone?.startsWith("+") && { phone: profileRow.phone })
    }

    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser(createUserParams)

    if (authError)
      throw new ProfileCreationError("Creating auth user", authError)

    let newProfileId = ""

    await db.transaction(async (trx) => {
      const [newProfile] = await trx
        .insert(ProfilesTable)
        .values({
          userId: authUser.user.id,
          ...profileRow,
          organizationId,
          aclCustomPermissions: profileRow.aclCustomPermissions ?? []
        })
        .returning({ id: ProfilesTable.id })

      if (!newProfile?.id) {
        throw new ProfileCreationError(
          "Creating profile",
          "Failed to create profile"
        )
      }

      newProfileId = newProfile.id
    })

    if (sendEmail) {
      // await sendWelcomeEmail({
      //   email,
      //   profile,
      //   appUrl,
      //   password
      // })
    }

    return newProfileId
  } catch (error) {
    console.error("Profile creation failed", error)
    if (createdOrganizationId) {
      await db
        .delete(OrganizationsTable)
        .where(eq(OrganizationsTable.id, createdOrganizationId))
    }
    if (error instanceof ProfileCreationError) {
      throw error
    }
    throw new ProfileCreationError("Unknown error", error)
  }
}

export async function updateProfile(
  db: DBClient,
  {
    where,
    organizationId,
    data
  }: {
    where: {
      id: string
    }
    organizationId: string
    data: Omit<ProfileUpdate, "rbac" | "preferences" | "aclCustomPermissions">
  }
) {
  return db
    .update(ProfilesTable)
    .set(data)
    .where(
      and(
        eq(ProfilesTable.id, where.id),
        eq(ProfilesTable.organizationId, organizationId)
      )
    )
}

/**
 * Sends a Supabase invite email and creates the org profile row for the new auth user.
 * No separate `invites` table — the invite is represented by auth (pending confirmation)
 * plus a real `profiles` row tied to `user_id`. Add an `invites` table later if you need
 * resend/revoke/audit before an auth user exists.
 */
export async function inviteUserToOrganization(
  db: DBClient,
  supabaseAdmin: SupabaseClient,
  input: {
    organizationId: string
    email: string
    firstName: string
    lastName: string
    phone?: string
    aclRole: string
    appUrl: string
  }
): Promise<{ profileId: string }> {
  const normalizedEmail = input.email.trim().toLowerCase()
  const phone = input.phone?.trim() ?? ""

  const existingAuthUser = await db.query.UsersTable.findFirst({
    columns: { id: true },
    where: (u, { eq }) => eq(u.email, normalizedEmail)
  })

  if (existingAuthUser) {
    throw new ProfileCreationError("Inviting user", {
      message:
        "An account with this email already exists. Use another flow to add existing users to this organization."
    })
  }

  const duplicateInOrg = await checkEmailExists(db, {
    email: normalizedEmail,
    organizationId: input.organizationId
  })

  if (duplicateInOrg.exists) {
    throw new ProfileCreationError("User existence check", {
      exists: true,
      name: duplicateInOrg.employeeName
    })
  }

  const redirectBase = input.appUrl.replace(/\/$/, "")
  const redirectTo = `${redirectBase}/login`

  const { data: invited, error: inviteError } =
    await supabaseAdmin.auth.admin.inviteUserByEmail(normalizedEmail, {
      redirectTo,
      data: {
        first_name: input.firstName,
        last_name: input.lastName
      },
      ...(phone.startsWith("+") ? { phone } : {})
    })

  if (inviteError || !invited.user?.id) {
    throw new ProfileCreationError("Inviting user", inviteError ?? invited)
  }

  const userId = invited.user.id

  const { error: metaError } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      app_metadata: { aclRole: input.aclRole }
    }
  )

  if (metaError) {
    throw new ProfileCreationError("Updating invited user metadata", metaError)
  }

  const [inserted] = await db
    .insert(ProfilesTable)
    .values({
      organizationId: input.organizationId,
      userId,
      firstName: input.firstName,
      lastName: input.lastName,
      phone,
      avatar: "",
      inactive: false,
      aclRole: input.aclRole,
      aclCustomPermissions: [],
      preferences: {
        theme: { colorSchema: "system" },
        app: { accent_color: null, beta_features: false }
      }
    })
    .returning({ id: ProfilesTable.id })

  if (!inserted?.id) {
    throw new ProfileCreationError(
      "Creating profile for invite",
      "Failed to create profile"
    )
  }

  return { profileId: inserted.id }
}

export async function checkEmailExists(
  db: DBClient,
  input: { email: string; organizationId: string }
) {
  const { email, organizationId } = input

  const existingUser = await db.query.UsersTable.findFirst({
    columns: {
      id: true
    },
    where: (u, { eq }) => eq(u.email, email)
  })

  if (existingUser) {
    const profile = await db.query.ProfilesTable.findFirst({
      columns: {
        firstName: true,
        lastName: true
      },
      where: (p, { eq, and }) =>
        and(eq(p.userId, existingUser.id), eq(p.organizationId, organizationId))
    })

    if (profile?.firstName && profile?.lastName) {
      return {
        exists: true,
        employeeName: `${profile.firstName} ${profile.lastName}`.trim()
      }
    }
  }

  return {
    exists: false
  }
}
