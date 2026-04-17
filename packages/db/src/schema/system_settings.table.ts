import { index, pgTable } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

import type { z } from "zod/v4"

import { timestamps } from "../lib/utils"
import { OrganizationsTable } from "./organizations.table"

// ** TABLE ** //
export const SystemSettingsTable = pgTable(
  "system_settings",
  (db) => ({
    organizationId: db
      .uuid("organization_id")
      .primaryKey()
      .references(() => OrganizationsTable.id, { onDelete: "cascade" }),
    maintenanceMode: db.boolean("maintenance_mode").default(false).notNull(),
    emailNotificationEnable: db
      .boolean("email_notification_enable")
      .default(true)
      .notNull(),
    globalNotificationEnable: db
      .boolean("global_notification_enable")
      .default(true)
      .notNull(),
    rateLimit: db.integer("rate_limit"),
    secureMode: db.boolean("secure_mode").default(false).notNull(),
    // Resend provider consolidated configuration
    resendEnabled: db.boolean("resend_enabled").default(false).notNull(),
    resendProvider: db.text("resend_provider").default("resend").notNull(),
    resendApiKey: db.text("resend_api_key"),
    resendFromEmail: db.text("resend_from_email"),
    resendDomain: db.text("resend_domain"),
    resendSmtpHost: db.text("resend_smtp_host"),
    resendSmtpPort: db.integer("resend_smtp_port"),
    resendSmtpUser: db.text("resend_smtp_user"),
    resendSmtpPass: db.text("resend_smtp_pass"),
    resendRateLimit: db.integer("resend_rate_limit"),
    ...timestamps
  }),
  (table) => ({
    maintenanceModeIdx: index("system_settings_maintenance_mode_idx").on(
      table.maintenanceMode
    ),
    emailNotificationEnableIdx: index(
      "system_settings_email_notification_enable_idx"
    ).on(table.emailNotificationEnable),
    globalNotificationEnableIdx: index(
      "system_settings_global_notification_enable_idx"
    ).on(table.globalNotificationEnable),
    resendEnabledIdx: index("system_settings_resend_enabled_idx").on(
      table.resendEnabled
    )
  })
)

const adjustSchema = {}

const systemSettingsInsertSchema = createInsertSchema(
  SystemSettingsTable,
  adjustSchema
).omit({
  createdAt: true,
  updatedAt: true
})

const systemSettingsSelectSchema = createSelectSchema(
  SystemSettingsTable,
  adjustSchema
)

const systemSettingsUpdateSchema = systemSettingsSelectSchema
  .omit({
    organizationId: true,
    createdAt: true,
    updatedAt: true
  })
  .partial()

export const systemSettingsSchema = {
  insert: systemSettingsInsertSchema,
  select: systemSettingsSelectSchema,
  update: systemSettingsUpdateSchema
}

export type SystemSettingsInsert = z.infer<typeof systemSettingsSchema.insert>
export type SystemSettingsSelect = z.infer<typeof systemSettingsSchema.select>
export type SystemSettingsUpdate = z.infer<typeof systemSettingsSchema.update>
