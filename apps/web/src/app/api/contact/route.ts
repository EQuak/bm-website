import { NextResponse } from "next/server"
import { z } from "zod"
import { siteConfig } from "#/core/config/site"
import { env } from "#/env"

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Enter a valid email address"),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Please share a bit more detail (20+ characters)"),
  captchaToken: z.string().min(1, "Captcha required")
})

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid JSON body" } },
      { status: 400 }
    )
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors
    return NextResponse.json(
      {
        error: {
          message: "Validation error",
          fieldErrors: {
            name: fieldErrors.name?.[0],
            email: fieldErrors.email?.[0],
            company: fieldErrors.company?.[0],
            message: fieldErrors.message?.[0],
            captchaToken: fieldErrors.captchaToken?.[0]
          }
        }
      },
      { status: 400 }
    )
  }

  const { name, email, company, message } = parsed.data

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    undefined

  const verifyRes = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.RECAPTCHA_SECRET_KEY,
        response: parsed.data.captchaToken,
        ...(ip ? { remoteip: ip } : {})
      })
    }
  )

  const verifyJson = (await verifyRes.json().catch(() => null)) as {
    success: boolean
    "error-codes"?: string[]
  } | null

  if (!verifyJson?.success) {
    return NextResponse.json(
      {
        error: {
          message: "Captcha verification failed. Please try again.",
          fieldErrors: { captchaToken: "Please complete the captcha" }
        }
      },
      { status: 400 }
    )
  }

  const subject = `New inquiry — ${siteConfig.name}`
  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
      <h2 style="margin: 0 0 12px;">New contact inquiry</h2>
      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin: 0 0 8px;"><strong>Company:</strong> ${escapeHtml(
        company?.trim() ? company : "—"
      )}</p>
      <hr style="margin: 16px 0; border: 0; border-top: 1px solid #e5e7eb;" />
      <p style="margin: 0 0 8px;"><strong>Message</strong></p>
      <pre style="white-space: pre-wrap; margin: 0; padding: 12px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px;">${escapeHtml(
        message
      )}</pre>
    </div>
  `.trim()

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject,
      html
    })
  })

  if (!resendRes.ok) {
    let details: unknown = undefined
    try {
      details = await resendRes.json()
    } catch {
      // ignore
    }
    return NextResponse.json(
      { error: { message: "Failed to send message", details } },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
