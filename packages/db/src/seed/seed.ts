/**
 * ! Executing this script will delete all data in your database and seed it with 10 users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */

import { getTableColumns } from "drizzle-orm"

import {
  DEFAULT_ORGANIZATION_ID,
  DEFAULT_ORGANIZATION_SLUG,
  INTERNAL_ORGANIZATION_ID,
  INTERNAL_ORGANIZATION_SLUG
} from "../lib/default-organization"
import { OrganizationsTable, ProfilesTable } from "../schema"
import { db } from "./seed-db-client"
import { seedAclsRoles } from "./funcs/acls_roles_seed"
import { createAuthUsers } from "./funcs/authUsers_seed"
import { DEFAULT_PROFILES } from "./funcs/profiles_seed"

const main = async () => {
  const supabaseEnv = process.env.POSTGRES_URL
  if (!supabaseEnv?.includes("127.0.0.1")) {
    console.log("error: enviroment not allowed to seed")
    process.exit(1)
  }

  console.log("seeding database at - ", supabaseEnv)

  // Sleep for 1 second to allow the database to be ready
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Seed Default Users
    console.log("Seeding default users Start")
    console.time("Seeding default users")
    const defaultUsers = await createAuthUsers()
    console.timeEnd("Seeding default users")

    // Seed Acls Roles
    console.time("Seeding Acls Roles")
    await seedAclsRoles(db)
    console.timeEnd("Seeding Acls Roles")

    console.time("Seeding organizations")
    await db
      .insert(OrganizationsTable)
      .values([
        {
          id: DEFAULT_ORGANIZATION_ID,
          name: "Default",
          slug: DEFAULT_ORGANIZATION_SLUG,
          inactive: false
        },
        {
          id: INTERNAL_ORGANIZATION_ID,
          name: "Internal",
          slug: INTERNAL_ORGANIZATION_SLUG,
          inactive: false
        }
      ])
      .onConflictDoNothing({ target: OrganizationsTable.slug })
    console.timeEnd("Seeding organizations")

    
    // Ensure global system settings row exists (defaults handled in code)
    // console.time("Ensure system settings global row")
    // await db.execute(
    //   sql`INSERT INTO system_settings (id) VALUES ('global') ON CONFLICT (id) DO NOTHING`
    // )
    // console.timeEnd("Ensure system settings global row")

    // await createAuthUsers(db, 0)

    // Seed Default Profiles
    console.time("Seeding default profiles")
    const preProfiles = DEFAULT_PROFILES.map((p, i) => ({
      ...p,
      userId: defaultUsers[i]?.id
      // biome-ignore lint/suspicious/noExplicitAny: its ok use here
    })) as any
    const defaultProfiles = await db
      .insert(ProfilesTable)
      .values(preProfiles)
      .returning({ ...getTableColumns(ProfilesTable) })
    console.timeEnd("Seeding default profiles")

    // Type completion not working? You might want to reload your TypeScript Server to pick up the changes
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
  .then(() => {
    console.log("Database seeded successfully!")
  })
  .catch((error) => {
    console.error(error)
  })
