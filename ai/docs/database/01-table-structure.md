# Database table structure

This guide explains how to create and structure tables using Drizzle ORM with TypeScript.

## Basic Structure

Our table structure follows a consistent pattern:

1. Required imports
2. Table definition
3. Relations
4. Zod schemas
5. TypeScript types

### Base Example

```typescript
import { relations } from "drizzle-orm"
import { pgTable } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { v7 as uuidv7 } from "uuid"
import { z } from "zod"

// 1. Table Definition
export const InventoryTable = pgTable("inventory", {
  id: d
    .uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  itemSku: d.text("itemSku").notNull(), // Note: camelCase column names
  createdAt: d.timestamp("createdAt").defaultNow(),
  updatedAt: d.timestamp("updatedAt").defaultNow()
})

// 2. Relations
export const InventoryTableRelations = relations(
  InventoryTable,
  ({ one, many }) => ({
    location: one(LocationTable, {
      // Note: no underscore prefix
      fields: [InventoryTable.locationId],
      references: [LocationTable.id]
    }),
    transactions: many(TransactionTable)
  })
)

// 3. Schemas
const adjustmentSchema = {
  // Custom validations
}

const inventoryTableCreateInsertSchema = createInsertSchema(
  InventoryTable,
  adjustmentSchema
)
const inventoryTableSelectSchema = createSelectSchema(InventoryTable)

export const InventoryTableSchemas = {
  insert: inventoryTableCreateInsertSchema,
  select: inventoryTableSelectSchema,
  update: inventoryTableCreateInsertSchema
}

// 4. Types
export type InventoryTableSchemas = z.infer<typeof inventoryTableSelectSchema>
export type InventoryTableInsert = z.infer<
  typeof inventoryTableCreateInsertSchema
>
```

## Naming Conventions

### 1. Column Names

- Use camelCase for column names
- Be descriptive and clear
- Follow TypeScript naming conventions

```typescript
// Good
firstName: d.text("firstName")
lastLoginAt: d.timestamp("lastLoginAt")

// Avoid
first_name: d.text("first_name")
last_login_at: d.timestamp("last_login_at")
```

### 2. Relations

- Use descriptive names without underscore prefix
- Name should reflect the relationship

```typescript
// Good
export const UserTableRelations = relations(UserTable, ({ one, many }) => ({
  profile: one(ProfileTable),
  posts: many(PostTable)
}))

// Avoid
export const UserTableRelations = relations(UserTable, ({ one, many }) => ({
  _profile: one(ProfileTable),
  _posts: many(PostTable)
}))
```

### 3. Table Names

- Use PascalCase for table definitions
- Add 'Table' suffix
- Use domain prefixes for organization

```typescript
export const InventoryItemsTable = pgTable("inventoryItems", {})
export const InventoryLocationsTable = pgTable("inventoryLocations", {})
```

## Best Practices

1. **Schema Organization**

   - Group related tables in folders
   - Use index files for exports
   - Keep schemas close to table definitions
   - Use consistent file naming

2. **Type Safety**

   - Always define Zod schemas
   - Export type definitions
   - Use strict TypeScript settings
   - Leverage Drizzle's type inference

3. **Relations**

   - Define relations in separate constants
   - Use meaningful relationship names
   - Consider indexing for foreign keys
   - Document complex relationships

4. **Validation**

   - Use Zod for schema validation
   - Define custom validation rules
   - Validate at the schema level
   - Handle edge cases

5. **Timestamps**

   - Include createdAt and updatedAt
   - Use consistent timestamp handling
   - Consider timezone handling
   - Use automatic updates when possible

## Enum Handling

We use a structured approach for handling enums that provides both type safety and user-friendly labels:

### 1. Enum Definition Pattern

```typescript
// Define the enum object with values and labels
export const TICKET_STATUS = {
  DRAFT: { value: "DRAFT", label: "Draft" },
  OPEN: { value: "OPEN", label: "Open" },
  IN_PROGRESS: { value: "IN_PROGRESS", label: "In Progress" }
} as const

// Extract enum array for pgEnum
export const ticketStatusArray = Object.values(TICKET_STATUS).map(
  status => status.value
) as [keyof typeof TICKET_STATUS, ...(keyof typeof TICKET_STATUS)[]]

// Create the PostgreSQL enum
export const ticketsStatusPGEnum = pgEnum("enum_name", ticketStatusArray)

// Zod schema for validation
export const ticketStatusSchema = z.enum(ticketStatusArray)

// TypeScript type
export type TicketStatus = z.infer<typeof ticketStatusSchema>
```

### 2. Benefits

- Single source of truth for enum values and labels
- Type safety through TypeScript and Zod
- Consistent enum handling across backend and frontend
- Easy to use in UI components with predefined labels
- PostgreSQL enum type support via Drizzle

### 3. Usage Example

```typescript
// In table definition
export const TicketsTable = pgTable("tickets", {
  status: ticketsStatusPGEnum("status")
    .notNull()
    .default(TICKET_STATUS.DRAFT.value)
})

// In frontend components
const statusOptions = Object.values(TICKET_STATUS).map(({ value, label }) => ({
  value,
  label
}))
```

This structure ensures:

- Type safety throughout the application
- Consistent database schema
- Clear and maintainable code
- Efficient querying capabilities
- Easy schema evolution
