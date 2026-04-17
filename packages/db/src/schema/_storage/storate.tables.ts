import { sql } from "drizzle-orm"
import {
  bigint,
  boolean,
  foreignKey,
  index,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core"

export const storage = pgSchema("storage")

export const bucketsInStorage = storage.table(
  "buckets",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    owner: uuid("owner"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string"
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string"
    }).defaultNow(),
    public: boolean("public").default(false),
    avifAutodetection: boolean("avif_autodetection").default(false),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    fileSizeLimit: bigint("file_size_limit", { mode: "number" }),
    allowedMimeTypes: text("allowed_mime_types").array(),
    ownerId: text("owner_id")
  },
  (table) => [uniqueIndex("bname").using("btree", table.name.asc().nullsLast())]
)

export const objectsInStorage = storage.table(
  "objects",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    bucketId: text("bucket_id"),
    name: text("name"),
    owner: uuid("owner"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string"
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string"
    }).defaultNow(),
    lastAccessedAt: timestamp("last_accessed_at", {
      withTimezone: true,
      mode: "string"
    }).defaultNow(),
    metadata: jsonb("metadata"),
    pathTokens: text("path_tokens")
      .array()
      .generatedAlwaysAs(sql`string_to_array(name, '/'::text)`),
    version: text("version"),
    ownerId: text("owner_id"),
    userMetadata: jsonb("user_metadata")
  },
  (table) => [
    uniqueIndex("bucketid_objname").using(
      "btree",
      table.bucketId.asc().nullsLast(),
      table.name.asc().nullsLast()
    ),
    index("idx_objects_bucket_id_name").using(
      "btree",
      table.bucketId.asc().nullsLast(),
      table.name.asc().nullsLast()
    ),
    index("name_prefix_search").using("btree", table.name.asc().nullsLast()),
    foreignKey({
      columns: [table.bucketId],
      foreignColumns: [bucketsInStorage.id],
      name: "objects_bucketId_fkey"
    })
  ]
)

export type ObjectsInStorage = typeof objectsInStorage.$inferSelect

export const migrationsInStorage = storage.table(
  "migrations",
  {
    id: integer("id").primaryKey().notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    hash: varchar("hash", { length: 40 }).notNull(),
    executedAt: timestamp("executed_at", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`
    )
  },
  (table) => [unique("migrations_name_key").on(table.name)]
)

export const s3MultipartUploadsPartsInStorage = storage.table(
  "s3_multipart_uploads_parts",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    uploadId: text("upload_id").notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    size: bigint("size", { mode: "number" }).default(0).notNull(),
    partNumber: integer("part_number").notNull(),
    bucketId: text("bucket_id").notNull(),
    key: text("key").notNull(),
    etag: text("etag").notNull(),
    ownerId: text("owner_id"),
    version: text("version").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.uploadId],
      foreignColumns: [s3MultipartUploadsInStorage.id],
      name: "s3_multipart_uploads_parts_upload_id_fkey"
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.bucketId],
      foreignColumns: [bucketsInStorage.id],
      name: "s3_multipart_uploads_parts_bucket_id_fkey"
    })
  ]
)

export const s3MultipartUploadsInStorage = storage.table(
  "s3_multipart_uploads",
  {
    id: text("id").primaryKey().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    inProgressSize: bigint("in_progress_size", { mode: "number" })
      .default(0)
      .notNull(),
    uploadSignature: text("upload_signature").notNull(),
    bucketId: text("bucket_id").notNull(),
    key: text("key").notNull(),
    version: text("version").notNull(),
    ownerId: text("owner_id"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    userMetadata: jsonb("user_metadata")
  },
  (table) => [
    index("idx_multipart_uploads_list").using(
      "btree",
      table.bucketId.asc().nullsLast(),
      table.key.asc().nullsLast(),
      table.createdAt.asc().nullsLast()
    ),
    foreignKey({
      columns: [table.bucketId],
      foreignColumns: [bucketsInStorage.id],
      name: "s3_multipart_uploads_bucket_id_fkey"
    })
  ]
)
