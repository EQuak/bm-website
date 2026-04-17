import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "../schema"

const connectionString =
  process.env.POSTGRES_URL

if (!connectionString?.includes("127.0.0.1")) {
  console.log("error: enviroment not allowed to seed")
  throw new Error("POSTGRES_URL is not set")
}

const client = postgres(connectionString, {
  prepare: false,
  onnotice: (notice) => {
    if (notice.code === "00000") return
    if (notice.code === "42622") return
    console.log(notice)
  }
})

export const db = drizzle(client, { schema })
