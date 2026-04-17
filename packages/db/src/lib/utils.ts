import _dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { sql } from "drizzle-orm"
import { timestamp } from "drizzle-orm/pg-core"
import { z } from "zod/v4"

_dayjs.extend(utc)
_dayjs.extend(timezone)

export const dayjs = _dayjs

export const timestamps = {
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true
  })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true
  }).$onUpdateFn(() => dayjs().toDate())
}

export const statusType = ["open", "pending", "complete", "closed"] as const
export const statusTypeEnum = z.enum(statusType)
export type StatusType = z.infer<typeof statusTypeEnum>

export const generateSlug = (slug: string, name: string) => {
  // normalize and format both inputs
  const normalizedSlug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  const normalizedName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  // concatenate slug and name with hyphens
  return `${normalizedSlug.toLowerCase()}-${normalizedName.toLowerCase().replace(/ /g, "-")}`
}
