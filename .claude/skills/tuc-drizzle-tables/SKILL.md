---
name: drizzle-tables
description: Drizzle ORM table patterns for this monorepo. Use when creating, editing, or manipulating database tables with Drizzle ORM and Drizzle Kit. Covers naming conventions (snake_case columns, PascalCase tables), timestamps utility, relations with underscore prefix, Zod schema refinements, and type exports.
---

# Drizzle ORM table patterns

## Basic Structure

Every database table file should follow this structure:

```typescript
import { relations } from "drizzle-orm";
import { pgTable, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { timestamps } from "@repo/db/utils";

// 1. Table Definition
export const ExampleTable = pgTable("example", db => ({
  id: db.uuid("id").primaryKey().$defaultFn(() => uuidv7()),
  first_name: db.text("first_name").notNull(),
  ...timestamps,
}));

// 2. Relations (MUST prefix with underscore)
export const _ExampleTableRelations = relations(ExampleTable, ({ one, many }) => ({
  _posts: many(PostTable),
  _profile: one(ProfileTable),
}));

// 3. Schemas with Refinements
const refinements = {
  first_name: (schema: z.ZodString) => schema.min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"), // Complete override
};

export const ExampleTableSchemas = {
  insert: createInsertSchema(ExampleTable, refinements),
  select: createSelectSchema(ExampleTable, refinements),
  update: createUpdateSchema(ExampleTable, refinements),
};

// 4. Types
export type Example = typeof ExampleTable.$inferSelect;
export type NewExample = typeof ExampleTable.$inferInsert;
```

## Critical Rules

### ALWAYS DO:
- Use `snake_case` for ALL column names (both in code and database)
- Use `PascalCase` with `Table` suffix for table definitions
- Import and spread `timestamps` from `@repo/db/utils`
- Prefix ALL relation names with underscore (`_posts`, `_profile`)
- Prefix relation variable names with underscore (`_ExampleTableRelations`)
- Use `uuidv7()` for primary keys
- Export insert, select, and update schemas
- Export inferred types

### NEVER DO:
- Use camelCase for column names
- Create custom timestamp fields (use the utility)
- Define relations without underscore prefix
- Skip schema exports
- Use `uuid()` instead of `uuidv7()`

## Naming Conventions

### Table Names
```typescript
// CORRECT
export const InventoryItemsTable = pgTable("inventory_items", {});
export const InventoryLocationsTable = pgTable("inventory_locations", {});

// WRONG
export const inventoryItems = pgTable("inventoryItems", {});
```

### Column Names
```typescript
// CORRECT
{
  first_name: db.text("first_name").notNull(),
  last_login_at: db.timestamp("last_login_at"),
  is_active: db.boolean("is_active").default(true),
}

// WRONG
{
  firstName: db.text("firstName"),
  lastLoginAt: db.timestamp("lastLoginAt"),
}
```

## Column Types

```typescript
{
  // Text fields
  full_name: db.text("full_name"),
  description: db.text("description"),

  // Numbers
  item_quantity: db.integer("item_quantity"),
  unit_price: db.decimal("unit_price", { precision: 10, scale: 2 }),

  // Dates
  start_date: db.timestamp("start_date", { mode: "date", withTimezone: true }),

  // Booleans
  is_active: db.boolean("is_active"),

  // Foreign Keys
  user_id: db.uuid("user_id").references(() => UserTable.id),

  // Enums with type assertion
  status: db.text("status").$type<TicketStatus>().default("DRAFT"),
}
```

## Relations

### One-to-Many
```typescript
export const _UserTableRelations = relations(UserTable, ({ many }) => ({
  _posts: many(PostTable, {
    fields: [UserTable.id],
    references: [PostTable.user_id],
  }),
}));
```

### One-to-One
```typescript
export const _UserTableRelations = relations(UserTable, ({ one }) => ({
  _profile: one(ProfileTable, {
    fields: [UserTable.id],
    references: [ProfileTable.user_id],
  }),
}));
```

### Many-to-Many (Junction Table)
```typescript
// Junction table
export const UserRolesTable = pgTable("user_roles", db => ({
  user_id: db.uuid("user_id").references(() => UserTable.id),
  role_id: db.uuid("role_id").references(() => RoleTable.id),
}), (t) => [
  primaryKey({ columns: [t.user_id, t.role_id] })
]);
```

## Enum Handling

```typescript
// Define enum values
export const REQUEST_ITEM_REPORT_STATUS = [
  "open",
  "in_progress",
  "cancelled",
  "completed"
] as const;

export type RequestItemReportStatus = (typeof REQUEST_ITEM_REPORT_STATUS)[number];

// Create PostgreSQL enum
export const RequestItemReportStatusEnum = pgEnum(
  "request_item_report_status",
  REQUEST_ITEM_REPORT_STATUS
);

// Use in table
export const RequestItemRptTable = pgTable("request_item_rpt", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  status: RequestItemReportStatusEnum("status").default("open"),
  ...timestamps
}));
```

## Schema Refinements

```typescript
// Extend existing schema
const refinements = {
  first_name: (schema: z.ZodString) =>
    schema.min(2, "Name must be at least 2 characters"),

  // Complete override
  email: z.string().email("Invalid email format"),

  // Complex validation
  preferences: z.object({
    theme: z.string(),
    notifications: z.boolean()
  })
};

export const UserTableSchemas = {
  insert: createInsertSchema(UserTable, refinements),
  select: createSelectSchema(UserTable, refinements),
  update: createUpdateSchema(UserTable, refinements),
};
```

## Full Example

```typescript
import { relations } from "drizzle-orm"
import { pgEnum, pgTable, primaryKey } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import type { z } from "zod"
import { timestamps } from "../../lib/utils"
import { ProfilesTable } from "../profiles.table"

export const REQUEST_STATUS = ["open", "in_progress", "completed"] as const
export type RequestStatus = (typeof REQUEST_STATUS)[number]
export const RequestStatusEnum = pgEnum("request_status", REQUEST_STATUS)

export const RequestTable = pgTable("request", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  requester_id: t.uuid("requester_id").references(() => ProfilesTable.id),
  request_date: t.timestamp("request_date", { mode: "date", withTimezone: true }),
  reason: t.text("reason").default(""),
  status: RequestStatusEnum("status").default("open"),
  ...timestamps
}))

export const _RequestRelations = relations(RequestTable, ({ one, many }) => ({
  _requester: one(ProfilesTable, {
    fields: [RequestTable.requester_id],
    references: [ProfilesTable.id]
  }),
  _items: many(RequestItemsTable)
}))

export const requestSchemas = {
  insert: createInsertSchema(RequestTable),
  select: createSelectSchema(RequestTable),
  update: createUpdateSchema(RequestTable)
}

export type RequestInsert = z.infer<typeof requestSchemas.insert>
export type RequestSelect = z.infer<typeof requestSchemas.select>
export type RequestUpdate = z.infer<typeof requestSchemas.update>
```
