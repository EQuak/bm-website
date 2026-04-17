import type { DBClient } from "../../client"
import { AclsRolesTable } from "../../schema"

export const ACLS_ROLES = [
  {
    name: "User",
    slug: "user"
  },
  {
    name: "Admin",
    slug: "admin"
  }
]

export const seedAclsRoles = async (seed: DBClient) => {
  const roles = await seed.insert(AclsRolesTable).values(ACLS_ROLES)
  return roles
}
