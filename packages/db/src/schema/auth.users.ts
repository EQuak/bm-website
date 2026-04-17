// Used to setup foreign key from profile.id to auth.users table in Supabase
import { pgSchema } from "drizzle-orm/pg-core"

const AuthTableSchema = pgSchema("auth")

export const UsersTable = AuthTableSchema.table("users", (db) => ({
  instanceId: db.uuid("instance_id"),
  id: db.uuid("id").primaryKey().defaultRandom(),
  aud: db.varchar("aud", { length: 255 }),
  role: db.varchar("role", { length: 255 }),
  email: db.varchar("email", { length: 255 }),
  encryptedPassword: db.varchar("encrypted_password", { length: 255 }),
  emailConfirmedAt: db.timestamp("email_confirmed_at", { mode: "date" }),
  invitedAt: db.timestamp("invited_at"),
  // confirmationToken: varchar("confirmation_token", { length: 255 }),
  // confirmationSentAt: timestamp("confirmation_sent_at"),
  // recoveryToken: varchar("recovery_token", { length: 255 }),
  // recoverySentAt: timestamp("recovery_sent_at"),
  // emailChangeTokenNew: varchar("email_change_token_new", { length: 255 }),
  // emailChange: varchar("email_change", { length: 255 }),
  // emailChangeSentAt: timestamp("email_change_sent_at"),
  lastSignInAt: db.timestamp("last_sign_in_at", { mode: "date" }),
  rawAppMetaData: db.jsonb("raw_app_meta_data").default({}),
  rawUserMetaData: db.jsonb("raw_user_meta_data").default({}),
  isSuperAdmin: db.boolean("is_super_admin"),
  createdAt: db.timestamp("created_at", { mode: "date" }),
  updatedAt: db.timestamp("updated_at", { mode: "date" }),
  phone: db.text("phone"),
  // phoneConfirmedAt: timestamp("phone_confirmed_at"),
  // phoneChange: text("phone_change"),
  // phoneChangeToken: varchar("phone_change_token", { length: 255 }),
  // phoneChangeSentAt: timestamp("phone_change_sent_at"),
  // confirmedAt: timestamp("confirmed_at"),
  // emailChangeTokenCurrent: varchar("email_change_token_current", {
  //   length: 255
  // }),
  // emailChangeConfirmStatus: smallint("email_change_confirm_status"),
  // bannedUntil: timestamp("banned_until"),
  reauthenticationToken: db.varchar("reauthentication_token", {
    length: 255
  }),
  reauthenticationSentAt: db.timestamp("reauthentication_sent_at"),
  isSsoUser: db.boolean("is_sso_user"),
  deletedAt: db.timestamp("deleted_at"),
  isAnonymous: db.boolean("is_anonymous")
}))

export type AuthUsers = typeof UsersTable.$inferSelect
