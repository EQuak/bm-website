import { and, eq, inArray } from "@repo/db"
import type { ModuleKey } from "@repo/db/acl"
import { Modules } from "@repo/db/acl"
import type { DBClient } from "@repo/db/client"
import type { AclsRoleInsert } from "@repo/db/schema"
import {
  AclsRolesPermissionsTable,
  AclsRolesTable,
  aclsRolesSchema
} from "@repo/db/schema"

export async function getAclsRoleBySlug(
  db: DBClient,
  { slug }: { slug: string }
) {
  return db.query.AclsRolesTable.findFirst({
    where: (AclsRoles, { eq }) => eq(AclsRoles.slug, slug)
  })
}

export async function addAclsRole(db: DBClient, aclsRoleData: AclsRoleInsert) {
  const validatedData = aclsRolesSchema.insert.parse(aclsRoleData)
  return db.insert(AclsRolesTable).values(validatedData).returning()
}

export async function getAclsRoles(db: DBClient) {
  return db.query.AclsRolesTable.findMany()
}

export async function getAclsRolesPermissions(
  db: DBClient,
  { roleSlug }: { roleSlug: string }
) {
  const permissions = await db.query.AclsRolesPermissionsTable.findMany({
    where: (AclsRolesPermissions, { eq }) =>
      eq(AclsRolesPermissions.roleSlug, roleSlug)
  })

  // One-time backward-compatible normalization:
  // Older rows used `actions.manage` meaning "add/edit".
  // Normalize in-memory and persist the normalized shape back to DB.
  const rowsNeedingNormalization = permissions.filter((p) => {
    const actions = p.permissions?.actions as
      | Record<string, boolean>
      | undefined
    return Boolean(actions && "manage" in actions)
  })

  if (rowsNeedingNormalization.length > 0) {
    const normalized = rowsNeedingNormalization.map((p) => {
      const actions = p.permissions?.actions as
        | Record<string, boolean>
        | undefined
      const manage = Boolean(actions?.manage)
      return {
        moduleKey: p.moduleKey,
        permissions: {
          actions: {
            view: Boolean(actions?.view),
            add: Boolean(actions?.add) || manage,
            edit: Boolean(actions?.edit) || manage
          }
        }
      }
    })

    await updateAclsRolePermissions(db, {
      roleSlug,
      permissions: normalized
    })
  }

  // Create a Set of valid module keys from Modules array
  const validModuleKeys = new Set(Modules.map((m) => m.moduleKey))

  // Find and remove obsolete modules
  const obsoleteModules = permissions.filter(
    (p) => !validModuleKeys.has(p.moduleKey)
  )
  if (obsoleteModules.length > 0) {
    await db.delete(AclsRolesPermissionsTable).where(
      and(
        eq(AclsRolesPermissionsTable.roleSlug, roleSlug),
        inArray(
          AclsRolesPermissionsTable.moduleKey,
          obsoleteModules.map((m) => m.moduleKey)
        )
      )
    )
  }

  if (permissions.length === 0) {
    // Define default permissions for all modules
    const defaultPermissions: AclsRolePermissionInsert[] = Modules.map(
      (module) => ({
        moduleKey: module.moduleKey,
        title: module.title,
        parentModuleKey: module.parentModuleKey,
        permissions: {
          actions: { view: false, add: false, edit: false }
        }
      })
    )

    await createAclsRolePermissions(db, {
      roleSlug,
      permissions: defaultPermissions
    })

    // Fetch the newly created permissions
    return db.query.AclsRolesPermissionsTable.findMany({
      where: (AclsRolesPermissions, { eq }) =>
        eq(AclsRolesPermissions.roleSlug, roleSlug)
    })
  }

  // Check for missing module permissions
  const existingModuleKeys = new Set(
    permissions
      .filter((p) => validModuleKeys.has(p.moduleKey))
      .map((p) => p.moduleKey)
  )
  const missingModules = Modules.filter(
    (module) => !existingModuleKeys.has(module.moduleKey)
  )

  if (missingModules.length > 0) {
    // Create default permissions for missing modules
    const defaultPermissions: AclsRolePermissionInsert[] = missingModules.map(
      (module) => ({
        moduleKey: module.moduleKey,
        title: module.title,
        parentModuleKey: module.parentModuleKey,
        permissions: {
          actions: { view: false, add: false, edit: false }
        }
      })
    )

    await createAclsRolePermissions(db, {
      roleSlug,
      permissions: defaultPermissions
    })

    // Return all permissions including newly created ones
    return db.query.AclsRolesPermissionsTable.findMany({
      where: (AclsRolesPermissions, { eq }) =>
        eq(AclsRolesPermissions.roleSlug, roleSlug)
    })
  }

  // Return normalized view to callers (even if update fails later).
  return permissions.map((p) => {
    const actions = p.permissions?.actions as
      | Record<string, boolean>
      | undefined
    if (!actions || !("manage" in actions)) return p
    const manage = Boolean(actions.manage)
    return {
      ...p,
      permissions: {
        actions: {
          view: Boolean(actions.view),
          add: Boolean(actions.add) || manage,
          edit: Boolean(actions.edit) || manage
        }
      }
    }
  })
}

export async function updateAclsRolePermissions(
  db: DBClient,
  {
    roleSlug,
    permissions
  }: {
    roleSlug: string
    permissions: {
      moduleKey: string
      permissions: {
        actions: Record<"view" | "add" | "edit", boolean>
      }
    }[]
  }
) {
  return db.transaction(async (tx) => {
    const updates = await Promise.all(
      permissions.map(({ moduleKey, permissions }) =>
        tx
          .update(AclsRolesPermissionsTable)
          .set({ permissions })
          .where(
            and(
              eq(AclsRolesPermissionsTable.roleSlug, roleSlug),
              eq(AclsRolesPermissionsTable.moduleKey, moduleKey as ModuleKey)
            )
          )
          .returning()
      )
    )
    return updates.flat()
  })
}

type AclsRolePermissionInsert = {
  moduleKey: ModuleKey
  title: string
  parentModuleKey?: ModuleKey | null
  permissions: {
    actions: {
      view: boolean
      add: boolean
      edit: boolean
    }
  }
}

export async function createAclsRolePermissions(
  db: DBClient,
  data: { roleSlug: string; permissions: AclsRolePermissionInsert[] }
) {
  return db.transaction(async (tx) => {
    // Transform the input array into individual permission records
    const permissionRecords = data.permissions.map((permission) => ({
      roleSlug: data.roleSlug,
      moduleKey: permission.moduleKey,
      title: permission.title,
      parentModuleKey: permission.parentModuleKey,
      permissions: {
        actions: {
          view: permission.permissions.actions.view,
          add: permission.permissions.actions.add,
          edit: permission.permissions.actions.edit
        }
      }
    }))

    return tx
      .insert(AclsRolesPermissionsTable)
      .values(permissionRecords)
      .returning()
  })
}
