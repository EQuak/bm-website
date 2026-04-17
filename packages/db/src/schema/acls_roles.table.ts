import { relations, sql } from "drizzle-orm"
import { index, pgTable } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

import type { z } from "zod/v4"

import { timestamps } from "../lib/utils"
import { AclsRolesPermissionsTable } from "./acls_roles_permissions.table"

// ** TABLE ** //
export const AclsRolesTable = pgTable(
  "acl_roles",
  (db) => ({
    id: db.text("id").generatedAlwaysAs(sql`slug`),
    slug: db.text("slug").primaryKey(),
    name: db.text("name").default("").notNull(),
    isVisible: db.boolean("is_visible").default(true),
    ...timestamps
  }),
  (table) => {
    return {
      slugIdx: index("acl_roles_slug_idx").on(table.slug)
    }
  }
)

export const aclsRolesRelations = relations(AclsRolesTable, ({ many }) => ({
  _permissions: many(AclsRolesPermissionsTable)
}))

const adjustSchema = {}

const aclsRolesInsertSchema = createInsertSchema(
  AclsRolesTable,
  adjustSchema
).omit({
  createdAt: true,
  updatedAt: true
})

const aclsRolesSelectSchema = createSelectSchema(AclsRolesTable, adjustSchema)

const aclsRolesUpdateSchema = aclsRolesSelectSchema
  .omit({
    createdAt: true,
    updatedAt: true
  })
  .partial()

export const aclsRolesSchema = {
  insert: aclsRolesInsertSchema,
  select: aclsRolesSelectSchema,
  update: aclsRolesUpdateSchema
}

export type AclsRoleInsert = z.infer<typeof aclsRolesSchema.insert>
export type AclsRoleSelect = z.infer<typeof aclsRolesSchema.select>
export type AclsRoleUpdate = z.infer<typeof aclsRolesSchema.update>
