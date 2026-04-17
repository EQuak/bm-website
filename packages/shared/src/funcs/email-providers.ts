import type { DBClient } from "@repo/db/client"
import { DEFAULT_ORGANIZATION_ID } from "@repo/db/default-organization"
import { Resend } from "resend"

// Constants & Types
type CachedClient = {
  resend: Resend
  fromEmail: string
  updatedAt: number
}

const CLIENT_TTL_MS = 60_000
const DEBUG = process.env.NODE_ENV === "development"
const cache = new Map<string, CachedClient>()

function debugLog(message: string, data?: unknown) {
  if (DEBUG) console.log(message, data)
}

// Cache helpers
export function invalidateResendClientCache(): void {
  cache.clear()
}

// Settings fetchers
export async function getSystemNotificationSettings(db: DBClient) {
  const settings = await db.query.SystemSettingsTable.findFirst({
    where: (t, { eq }) => eq(t.organizationId, DEFAULT_ORGANIZATION_ID)
  })
  return (
    settings || {
      organizationId: DEFAULT_ORGANIZATION_ID,
      maintenanceMode: false,
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
      resendRateLimit: null
    }
  )
}

// Validators
export async function canSendEmails(db: DBClient): Promise<boolean> {
  const s = await getSystemNotificationSettings(db)

  const keyFromDb = (s.resendApiKey || "").trim()
  const isMasked = keyFromDb.includes("*")
  const isValidKey = keyFromDb.length > 0 && !isMasked

  const hasProvider = Boolean(
    s.resendEnabled && isValidKey && s.resendFromEmail
  )

  const canSend = Boolean(
    s.globalNotificationEnable && s.emailNotificationEnable && hasProvider
  )

  debugLog("[canSendEmails]", {
    globalEnabled: s.globalNotificationEnable,
    emailEnabled: s.emailNotificationEnable,
    resendEnabled: s.resendEnabled,
    hasValidKey: isValidKey,
    hasFromEmail: Boolean(s.resendFromEmail),
    canSend
  })

  return canSend
}

// Client getters
export async function getResendClient(
  db: DBClient,
  _opts?: { clientKey?: string }
): Promise<{ resend: Resend; fromEmail: string }> {
  const cacheKey = "global"
  const now = Date.now()
  const cached = cache.get(cacheKey)
  if (cached && now - cached.updatedAt < CLIENT_TTL_MS) {
    debugLog("[getResendClient] Using cached client")
    return { resend: cached.resend, fromEmail: cached.fromEmail }
  }

  debugLog("[getResendClient] Cache miss or expired, fetching from DB")
  const s = await getSystemNotificationSettings(db)

  const keyFromDb = (s.resendApiKey || "").trim()
  const fromEmailDb = (s.resendFromEmail || "").trim()

  const isMasked = keyFromDb.includes("*")
  const isValidKey =
    keyFromDb.length >= 10 && !isMasked && keyFromDb.startsWith("re_")

  debugLog("[getResendClient] DB settings validation", {
    resendEnabled: s.resendEnabled,
    hasKey: keyFromDb.length > 0,
    keyLength: keyFromDb.length,
    isMasked,
    isValidKey,
    hasFromEmail: fromEmailDb.length > 0
  })

  if (s.resendEnabled && isValidKey && fromEmailDb) {
    const resend = new Resend(keyFromDb)
    const fromEmail = fromEmailDb
    const masked = `${keyFromDb.slice(0, 5)}${"*".repeat(Math.max(0, keyFromDb.length - 5))}`
    debugLog(
      `[getResendClient] ✓ Using DB Resend key: ${masked}, from: ${fromEmail}`
    )
    cache.set(cacheKey, { resend, fromEmail, updatedAt: now })
    return { resend, fromEmail }
  }

  const envKey = (process.env.RESEND_API_KEY || "").trim()
  const fromEmailFallback =
    process.env.RESEND_FROM_EMAIL || "App <onboarding@resend.dev>"

  if (!envKey || envKey.length < 10 || envKey.includes("*")) {
    debugLog("[getResendClient] ✗ No valid email provider found", {
      hasEnvKey: envKey.length > 0,
      envKeyLength: envKey.length,
      dbResendEnabled: s.resendEnabled,
      dbKeyLength: keyFromDb.length,
      dbIsMasked: isMasked
    })
    throw new Error(
      "No email provider configured. Configure system settings or set RESEND_API_KEY/.RESEND_FROM_EMAIL"
    )
  }

  console.warn("[getResendClient] ⚠️ Using .env fallback", {
    keyPreview: `${envKey.slice(0, 5)}***`,
    fromEmail: fromEmailFallback
  })
  const resend = new Resend(envKey)
  cache.set(cacheKey, { resend, fromEmail: fromEmailFallback, updatedAt: now })
  return { resend, fromEmail: fromEmailFallback }
}

// Utils
export function resolveDefaultClientKey(): string {
  return process.env.NODE_ENV === "development" ? "dev" : "admin"
}

export async function getEmailRateLimit(db: DBClient): Promise<number> {
  const s = await getSystemNotificationSettings(db)
  return (
    (typeof s.resendRateLimit === "number" && s.resendRateLimit > 0
      ? s.resendRateLimit
      : undefined) ||
    (typeof s.rateLimit === "number" && s.rateLimit > 0
      ? s.rateLimit
      : undefined) ||
    2
  )
}
