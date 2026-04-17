import { relations } from "drizzle-orm"
import { index, pgTable, primaryKey } from "drizzle-orm/pg-core"

import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import type { z } from "zod/v4"

import type { ModuleKey, Permission } from "../acl/rbac_schema"
import { moduleOptions, permissionSchema } from "../acl/rbac_schema"
import { timestamps } from "../lib/utils"
import { AclsRolesTable } from "./acls_roles.table"

// ** TABLE ** //
export const AclsRolesPermissionsTable = pgTable(
  "acls_roles_permissions",
  (db) => ({
    roleSlug: db.text("role_slug").references(() => AclsRolesTable.slug, {
      onDelete: "cascade"
    }),
    moduleKey: db.text("module_key").$type<ModuleKey>().notNull(),
    title: db.text("title").notNull(),
    parentModuleKey: db.text("parent_module_key").$type<ModuleKey>(),
    permissions: db
      .jsonb("permissions")
      .$type<Permission>()
      .notNull()
      .default({
        actions: { view: false, add: false, edit: false }
      }),
    ...timestamps
  }),
  (table) => [
    primaryKey({ columns: [table.roleSlug, table.moduleKey] }),
    index("acls_roles_permissions_role_slug_idx").on(table.roleSlug),
    index("acls_roles_permissions_parent_module_key_idx").on(
      table.parentModuleKey
    ),
    index("acls_roles_permissions_title_idx").on(table.title)
  ]
)

export const aclsRolesPermissionsRelations = relations(
  AclsRolesPermissionsTable,
  ({ one }) => ({
    role: one(AclsRolesTable, {
      fields: [AclsRolesPermissionsTable.roleSlug],
      references: [AclsRolesTable.slug]
    })
  })
)

const adjustSchema = {
  permissions: permissionSchema,
  moduleKey: moduleOptions,
  parentModuleKey: moduleOptions.nullish()
}

const aclsRolesPermissionsInsertSchema = createInsertSchema(
  AclsRolesPermissionsTable,
  adjustSchema
).omit({
  createdAt: true,
  updatedAt: true
})

const aclsRolesPermissionsSelectSchema = createSelectSchema(
  AclsRolesPermissionsTable,
  adjustSchema
)

const aclsRolesPermissionsUpdateSchema = aclsRolesPermissionsSelectSchema
  .omit({
    createdAt: true,
    updatedAt: true
  })
  .partial()

export const aclsRolesPermissionsSchema = {
  insert: aclsRolesPermissionsInsertSchema,
  select: aclsRolesPermissionsSelectSchema,
  update: aclsRolesPermissionsUpdateSchema
}

export type AclsRolePermissionInsert = z.infer<
  typeof aclsRolesPermissionsSchema.insert
>
export type AclsRolePermissionSelect = z.infer<
  typeof aclsRolesPermissionsSchema.select
>
export type AclsRolePermissionUpdate = z.infer<
  typeof aclsRolesPermissionsSchema.update
>
