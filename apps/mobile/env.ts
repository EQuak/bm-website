import Constants from "expo-constants"
import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  EXPO_PUBLIC_SUPABASE_URL: z.string(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional()
})

// In Expo, environment variables are available through Constants.expoConfig.extra
const _env = {
  NODE_ENV: (process.env.NODE_ENV ||
    (__DEV__ ? "development" : "production")) as
    | "development"
    | "test"
    | "production",
  EXPO_PUBLIC_SUPABASE_URL:
    Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY:
    Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY
}

// Validate environment variables
const parsed = envSchema.safeParse(_env)

if (!parsed.success) {
  console.warn(
    "⚠️ Some environment variables are missing:",
    parsed.error.flatten().fieldErrors
  )
  // Don't throw in development for easier testing
  if (!__DEV__) {
    throw new Error("Invalid environment variables")
  }
}

export const env = parsed.data

// Type for environment variables
export type Env = z.infer<typeof envSchema>
