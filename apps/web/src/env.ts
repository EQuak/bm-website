import { createEnv } from "@t3-oss/env-nextjs"
import { vercel } from "@t3-oss/env-nextjs/presets"
import { z } from "zod"

export const env = createEnv({
  extends: [vercel()],
  shared: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development")
  },
  server: {
    RESEND_API_KEY: z.string().min(1),
    RESEND_FROM_EMAIL: z.string().min(3),
    CONTACT_TO_EMAIL: z.string().email(),
    RECAPTCHA_SECRET_KEY: z.string().min(1)
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().min(1)
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  },
  skipValidation:
    !!process.env.CI ||
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === "lint"
})
