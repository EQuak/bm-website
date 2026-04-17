import { defineConfig } from "drizzle-kit"

if (!process.env.POSTGRES_URL) {
  throw new Error("Missing POSTGRES_URL")
}

const nonPoolingUrl = process.env.POSTGRES_URL.replace(":6543", ":5432")

const config = defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  out: "../../supabase/migrations",
  migrations: {
    prefix: "supabase"
  },
  verbose: true,
  strict: true,
  dbCredentials: { url: nonPoolingUrl }
})

export default config
