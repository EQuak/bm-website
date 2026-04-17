import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "./schema"

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not set")
}
const connectionString = process.env.POSTGRES_URL
// const connectionString =
//   "postgresql://postgres:postgres@127.0.0.1:54322/postgres"

const client = postgres(connectionString, {
  prepare: false,
  onnotice: (notice) => {
    if (notice.code === "00000") return
    if (notice.code === "42622") return
    console.log(notice)
  }
})

export const db = drizzle(client, { schema })
export type DBClient = typeof db
