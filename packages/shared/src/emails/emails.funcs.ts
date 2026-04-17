import type { DBClient } from "@repo/db/client"
import type { ProfileInsert } from "@repo/db/schema"
import {
  DeactivatedUserEmail,
  EmailNotificationEmail,
  ReactivatedUserEmail,
  WelcomeEmail
} from "@repo/react-email/emails"
import type React from "react"
import type { Resend } from "resend"
import {
  canSendEmails,
  getResendClient,
  resolveDefaultClientKey
} from "../funcs"

async function getProvider(
  db?: DBClient,
  clientKey?: string
): Promise<{ resend: Resend; fromEmail: string }> {
  if (db) {
    const { resend: providerResend, fromEmail } = await getResendClient(db, {
      clientKey: clientKey || resolveDefaultClientKey()
    })
    return { resend: providerResend, fromEmail }
  }
  // Fallback for backward compatibility (shouldn't happen in normal flow)
  throw new Error("Database client is required for email operations")
}

/**
 * Check if we're running in development environment
 */
export function isDevelopmentEnvironment(): boolean {
  // Check multiple indicators for development environment
  const nodeEnv = process.env.NODE_ENV
  const mode = process.env.MODE
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ""

  return (
    nodeEnv === "development" ||
    mode === "development" ||
    appUrl.includes("localhost") ||
    appUrl.includes("127.0.0.1") ||
    appUrl.includes("0.0.0.0")
  )
}

/**
 * Sanitize email for development - redirect all emails to test address
 */
export function sanitizeEmailForDevelopment(email: string): string {
  if (isDevelopmentEnvironment()) {
    console.log(
      `🔒 [DEV SECURITY] Redirecting email from ${email} to delivered@resend.dev`
    )
    return "delivered@resend.dev"
  }
  return email
}

function isLocalUrl(url: string): boolean {
  const localPatterns = [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
    "10.",
    "192.168.",
    "172.16.",
    "172.17.",
    "172.18.",
    "172.19.",
    "172.20.",
    "172.21.",
    "172.22.",
    "172.23.",
    "172.24.",
    "172.25.",
    "172.26.",
    "172.27.",
    "172.28.",
    "172.29.",
    "172.30.",
    "172.31."
  ]

  return localPatterns.some((pattern) => url.includes(pattern))
}

async function fetchFileAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      console.error(
        `Failed to fetch file: ${response.status} ${response.statusText}`
      )
      return null
    }

    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")

    return base64
  } catch (error) {
    console.error(`Error fetching file from ${url}:`, error)
    return null
  }
}

export async function sendWelcomeEmail(
  {
    email,
    profile,
    appUrl,
    password
  }: {
    email: string
    profile: ProfileInsert
    appUrl: string
    password?: string
  },
  db?: DBClient,
  clientKey?: string
) {
  const loginUrl = `${appUrl}`
  try {
    if (db && !(await canSendEmails(db))) return
    const { resend: provider, fromEmail } = await getProvider(db, clientKey)
    const { error } = await provider.emails.send({
      from: fromEmail,
      to: sanitizeEmailForDevelopment(email),
      subject: "Welcome to True Up Companies",
      react: WelcomeEmail({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: email,
        loginUrl,
        password
      })
    })

    if (error) throw error
  } catch (error) {
    console.error("Failed to send welcome email", error)
    // Email sending failure is logged but doesn't prevent user creation
  }
}

export async function sendDeactivatedUserEmail(
  {
    email,
    firstName,
    lastName,
    deactivationDateTime,
    reason
  }: {
    email: string
    firstName: string
    lastName: string
    deactivationDateTime: string
    reason?: string
  },
  db?: DBClient,
  clientKey?: string
) {
  try {
    if (db && !(await canSendEmails(db))) return
    const { resend: provider, fromEmail } = await getProvider(db, clientKey)
    const { error } = await provider.emails.send({
      from: fromEmail,
      to: sanitizeEmailForDevelopment(email),
      subject: "Your account has been deactivated",
      react: DeactivatedUserEmail({
        email,
        firstName,
        lastName,
        deactivationDateTime,
        reason
      })
    })

    if (error) throw error
  } catch (error) {
    console.error("Failed to send deactivated user email", error)
  }
}

export async function sendReactivatedUserEmail(
  {
    email,
    firstName,
    lastName,
    reactivationDateTime,
    loginUrl
  }: {
    email: string
    firstName: string
    lastName: string
    reactivationDateTime: string
    loginUrl: string
  },
  db?: DBClient,
  clientKey?: string
) {
  try {
    if (db && !(await canSendEmails(db))) return
    const { resend: provider, fromEmail } = await getProvider(db, clientKey)
    const { error } = await provider.emails.send({
      from: fromEmail,
      to: sanitizeEmailForDevelopment(email),
      subject: "Your account has been reactivated",
      react: ReactivatedUserEmail({
        email,
        firstName,
        lastName,
        reactivationDateTime,
        loginUrl
      })
    })

    if (error) throw error
  } catch (error) {
    console.error("Failed to send reactivated user email", error)
  }
}

export async function sendEmailNotificationEmail({
  email,
  message,
  subject,
  link,
  attachments,
  fromEmailOverride,
  providerOverride
}: {
  email: string
  message: string
  subject: string
  link?: string
  attachments?: Array<{
    fileName: string
    fileUrl: string
    fileSize?: number
    mimeType?: string
  }>
  fromEmailOverride?: string
  providerOverride?: Resend
}): Promise<
  { success: true; emailId: string } | { success: false; error: unknown }
> {
  try {
    const validAttachments =
      attachments?.filter(
        (attachment) =>
          attachment?.fileName &&
          attachment?.fileUrl &&
          attachment?.fileUrl.trim() !== ""
      ) || []

    const resendAttachments: Array<{
      filename: string
      path?: string
      content?: string
    }> = []

    for (const attachment of validAttachments) {
      const isLocalhost = isLocalUrl(attachment.fileUrl)

      if (isLocalhost) {
        const base64Content = await fetchFileAsBase64(attachment.fileUrl)

        if (base64Content) {
          resendAttachments.push({
            filename: attachment.fileName,
            content: base64Content
          })
        }
        continue
      }

      resendAttachments.push({
        filename: attachment.fileName,
        path: attachment.fileUrl
      })
    }

    const localhostPathAttachments = resendAttachments.filter(
      (att) => att.path && isLocalUrl(att.path)
    )

    if (localhostPathAttachments.length > 0) {
      const safeAttachments = resendAttachments.filter(
        (att) => !att.path || !isLocalUrl(att.path)
      )

      resendAttachments.length = 0
      resendAttachments.push(...safeAttachments)
    }

    const emailPayload: {
      from: string
      to: string
      subject: string
      react: React.ReactElement
      attachments?: Array<{
        filename: string
        path?: string
        content?: string
      }>
    } = {
      from: fromEmailOverride || "App <onboarding@resend.dev>",
      to: sanitizeEmailForDevelopment(email),
      subject,
      react: EmailNotificationEmail({
        message,
        subject,
        link
      })
    }

    if (resendAttachments.length > 0) {
      emailPayload.attachments = resendAttachments
    }

    if (!providerOverride) {
      throw new Error("Provider is required for sendEmailNotificationEmail")
    }

    const { data, error } = await providerOverride.emails.send(emailPayload)

    if (error) {
      if (error.message?.includes("localhost") && validAttachments.length > 0) {
        const base64Attachments: Array<{
          filename: string
          content: string
        }> = []

        for (const attachment of validAttachments) {
          const base64Content = await fetchFileAsBase64(attachment.fileUrl)
          if (base64Content) {
            base64Attachments.push({
              filename: attachment.fileName,
              content: base64Content
            })
          }
        }

        const retryPayload = {
          ...emailPayload,
          attachments:
            base64Attachments.length > 0 ? base64Attachments : undefined
        }

        const { data: retryData, error: retryError } =
          await providerOverride.emails.send(retryPayload)

        if (retryError) {
          return { success: false, error: retryError }
        }

        if (!retryData?.id) {
          return {
            success: false,
            error: new Error("No email ID returned from Resend")
          }
        }

        return { success: true, emailId: retryData.id }
      }

      return { success: false, error }
    }

    if (!data?.id) {
      return {
        success: false,
        error: new Error("No email ID returned from Resend")
      }
    }

    return { success: true, emailId: data.id }
  } catch (error) {
    console.error("Failed to send email notification email", error)
    return { success: false, error }
  }
}
