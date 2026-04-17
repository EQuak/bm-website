import { eq } from "@repo/db"
import type { DBClient } from "@repo/db/client"
import { DEFAULT_ORGANIZATION_ID } from "@repo/db/default-organization"
import type { SystemSettingsSelect } from "@repo/db/schema"
import { SystemSettingsTable, systemSettingsSchema } from "@repo/db/schema"
import { invalidateResendClientCache } from "@repo/shared/funcs"

type PublicSystemSettings = Omit<SystemSettingsSelect, "resendApiKey"> & {
  hasEmailProvider: boolean
  resendApiKeyPreview: string | null
}

function getDefaultSettings() {
  return {
    organizationId: DEFAULT_ORGANIZATION_ID,
    maintenanceMode: false,
    secureMode: false,
    emailNotificationEnable: true,
    globalNotificationEnable: true,
    rateLimit: null,
    resendEnabled: false,
    resendProvider: "resend",
    resendApiKey: null,
    resendFromEmail: null,
    resendDomain: null,
    resendSmtpHost: null,
    resendSmtpPort: null,
    resendSmtpUser: null,
    resendSmtpPass: null,
    resendRateLimit: null,
    workdayEnabled: false,
    workdayTokenUrl: null,
    workdayReportUrl: null,
    workdayClientId: null,
    workdayClientSecret: null,
    workdayRefreshToken: null,
    workdayLastSyncAt: null,
    workdayLastSyncStatus: null,
    workdayLastSyncError: null
  } as const
}

function maskApiKey(key: string | null): string | null {
  if (!key) return null
  return `${key.slice(0, 5)}${"*".repeat(Math.max(0, key.length - 5))}`
}

/** Org/workspace admins: notification preference only (same DB row as app instance). */
export async function getOrgGeneralSettings(db: DBClient): Promise<{
  globalNotificationEnable: boolean
}> {
  const settings = await db.query.SystemSettingsTable.findFirst({
    where: (t, { eq }) => eq(t.organizationId, DEFAULT_ORGANIZATION_ID)
  })
  return {
    globalNotificationEnable: settings?.globalNotificationEnable ?? true
  }
}

export async function updateOrgGeneralSettings(
  db: DBClient,
  input: { globalNotificationEnable: boolean }
) {
  const [row] = await db
    .update(SystemSettingsTable)
    .set({ globalNotificationEnable: input.globalNotificationEnable })
    .where(eq(SystemSettingsTable.organizationId, DEFAULT_ORGANIZATION_ID))
    .returning()

  return row ?? null
}

/** Platform staff: full app-instance row (maintenance, email provider, etc.). */
export async function getSystemSettings(
  db: DBClient
): Promise<PublicSystemSettings> {
  const settings = await db.query.SystemSettingsTable.findFirst({
    where: (t, { eq }) => eq(t.organizationId, DEFAULT_ORGANIZATION_ID)
  })

  const current = settings || getDefaultSettings()
  const hasEmailProvider = Boolean(
    current.resendEnabled && current.resendApiKey && current.resendFromEmail
  )
  const resendApiKeyPreview = maskApiKey(current.resendApiKey)

  const { resendApiKey: _, ...safe } = current
  return {
    ...safe,
    hasEmailProvider,
    resendApiKeyPreview
  } as PublicSystemSettings
}

export async function updateSystemSettings(db: DBClient, input: unknown) {
  const { clearApiKey, ...raw } = (input || {}) as {
    clearApiKey?: boolean
  } & Record<string, unknown>

  const data = systemSettingsSchema.update.parse(raw)

  if (!("resendApiKey" in data)) {
    // nothing
  } else if (
    typeof data.resendApiKey === "string" &&
    data.resendApiKey.trim() === ""
  ) {
    delete (data as Record<string, unknown>).resendApiKey
  }

  if (clearApiKey) {
    ;(data as Record<string, unknown>).resendApiKey = null
    ;(data as Record<string, unknown>).resendEnabled = false
  }

  const result = await db
    .update(SystemSettingsTable)
    .set(data)
    .where(eq(SystemSettingsTable.organizationId, DEFAULT_ORGANIZATION_ID))
    .returning()

  invalidateResendClientCache()

  return result
}
