import { relations, sql } from "drizzle-orm"
import {
  index,
  pgTable,
  pgView,
  text,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod/v4"

import type { AppPreferences, ModuleKey } from "../acl/rbac_schema"
import { actionSchema } from "../acl/rbac_schema"
import { timestamps } from "../lib/utils"
import { AclsRolesTable } from "./acls_roles.table"
import { UsersTable } from "./auth.users"
import { OrganizationsTable } from "./organizations.table"

export const customAclSchema = z.object({
  moduleKey: z.custom<ModuleKey>(),
  actions: z.record(actionSchema, z.boolean()).or(z.object()).default({})
})

export type CustomAcl = z.infer<typeof customAclSchema>

// ** TABLE ** //
export const ProfilesTable = pgTable(
  "profiles",
  (db) => ({
    id: db.uuid("id").primaryKey().defaultRandom(),
    organizationId: db
      .uuid("organization_id")
      .notNull()
      .references(() => OrganizationsTable.id, { onDelete: "cascade" }),
    inactive: db.boolean("inactive").default(false),
    userId: db.uuid("user_id").references(() => UsersTable.id, {
      onDelete: "set null"
    }),
    firstName: db.text("first_name").notNull(),
    lastName: db.text("last_name").notNull(),
    fullName: db
      .text("full_name")
      .generatedAlwaysAs(sql`first_name || ' ' || last_name`),
    phone: db.text("phone").default(""),
    avatar: db.text("avatar").default(""),
    aclRole: db
      .text("acl_role")
      .references(() => AclsRolesTable.slug)
      .notNull()
      .default("user"),
    aclCustomPermissions: db
      .jsonb("acl_custom_permissions")
      .$type<CustomAcl[]>()
      .notNull()
      .default([]),
    preferences: db
      .jsonb("preferences")
      .$type<AppPreferences>()
      .default({
        theme: {
          colorSchema: "system"
        },
        app: {
          accent_color: null,
          beta_features: false
        }
      })
      .notNull(),
    ...timestamps
  }),
  (table) => [
    uniqueIndex("profiles_org_user_id_unique").on(
      table.organizationId,
      table.userId
    ),
    index("idx_organization_id").on(table.organizationId),
    index("idx_inactive").on(table.inactive),
    index("idx_userId").on(table.userId),
    index("idx_aclRole").on(table.aclRole),
    index("profiles_first_name_idx").on(table.firstName),
    index("profiles_last_name_idx").on(table.lastName),
    index("profiles_full_name_idx").on(table.fullName),
    index("profiles_phone_idx").on(table.phone)
  ]
)

// ** RELATIONS ** //
export const profilesRelations = relations(ProfilesTable, ({ one, many }) => ({
  _organization: one(OrganizationsTable, {
    fields: [ProfilesTable.organizationId],
    references: [OrganizationsTable.id]
  }),
  user: one(UsersTable, {
    fields: [ProfilesTable.userId],
    references: [UsersTable.id]
  }),
  _aclRole: one(AclsRolesTable, {
    fields: [ProfilesTable.aclRole],
    references: [AclsRolesTable.slug]
  })
}))

// ** SCHEMAS ** //
const adjustSchema = {
  firstName: z
    .string()
    .min(2, "Min 2 characters")
    // .regex(/^[a-zA-Z-]+(['. -]?[a-zA-Z-]+)*$/, "Invalid name")
    .transform((value) => value.replace(/\s+/g, " ").trim())
    .transform((value) =>
      value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    ),
  lastName: z
    .string()
    .min(1, "Min 2 characters")
    // .regex(/^[a-zA-Z-]+(['. -]?[a-zA-Z-]+)*$/, "Invalid name")
    .transform((value) => value.replace(/\s+/g, " ").trim())
    .transform((value) =>
      value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    )
}

const profilesInsertSchema = createInsertSchema(
  ProfilesTable,
  adjustSchema
).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

const profilesSelectSchema = createSelectSchema(ProfilesTable, adjustSchema)

const profilesUpdateSchema = profilesSelectSchema
  .omit({
    createdAt: true,
    updatedAt: true,
    fullName: true,
    userId: true,
    organizationId: true
  })
  .partial()

export const profilesSchema = {
  insert: profilesInsertSchema,
  select: profilesSelectSchema,
  update: profilesUpdateSchema
}

export type ProfileInsert = z.infer<typeof profilesSchema.insert>
export type ProfileSelect = z.infer<typeof profilesSchema.select>
export type ProfileUpdate = z.infer<typeof profilesSchema.update>

export const ProfilesWithACLRoles = pgView("profiles_with_acl_roles", {
  profileId: uuid("profile_id")
    .notNull()
    .references(() => ProfilesTable.id),
  roleSlug: text("role_slug")
    .notNull()
    .references(() => AclsRolesTable.slug),
  fullName: text("full_name").notNull()
}).as(sql`
  SELECT
    p.id AS profile_id,
    r.slug AS role_slug,
    p.full_name
  FROM profiles p
  INNER JOIN acl_roles r ON r.slug = p.acl_role
`)
