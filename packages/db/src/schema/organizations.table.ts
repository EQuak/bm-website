import { index, pgTable } from "drizzle-orm/pg-core"
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema
} from "drizzle-zod"

import type { z } from "zod/v4"

import { timestamps } from "../lib/utils"

export const OrganizationsTable = pgTable(
  "organizations",
  (db) => ({
    id: db.uuid("id").primaryKey().defaultRandom(),
    name: db.text("name").notNull(),
    slug: db.text("slug").notNull().unique(),
    inactive: db.boolean("inactive").default(false).notNull(),
    ...timestamps
  }),
  (table) => [
    index("organizations_slug_idx").on(table.slug),
    index("organizations_inactive_idx").on(table.inactive)
  ]
)

const organizationsInsertSchema = createInsertSchema(OrganizationsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

const organizationsSelectSchema = createSelectSchema(OrganizationsTable)

const organizationsUpdateSchema = createUpdateSchema(OrganizationsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const organizationsSchema = {
  insert: organizationsInsertSchema,
  select: organizationsSelectSchema,
  update: organizationsUpdateSchema
}

export type OrganizationInsert = z.infer<typeof organizationsSchema.insert>
export type OrganizationSelect = z.infer<typeof organizationsSchema.select>
export type OrganizationUpdate = z.infer<typeof organizationsSchema.update>
