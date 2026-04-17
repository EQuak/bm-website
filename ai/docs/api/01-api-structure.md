# API structure

The `api` package is the core of all backend logic, using tRPC for type-safe routing. This documentation explains the organization and patterns used.

## Folder Structure

```
packages/api/
├── src/
│   ├── router/               # tRPC routers organized by domain
│   │   ├── inventory/       # Inventory related routes
│   │   ├── shared/         # Shared routes
│   │   └── ROUTERS.md      # Router documentation
│   ├── funcs/              # Business logic functions
│   │   ├── inventory/      # Inventory related functions
│   │   ├── shared/        # Shared functions
│   │   └── FUNCS.md       # Functions documentation
│   ├── schema/            # Drizzle schemas and types
│   ├── utils/             # Utility functions
│   ├── root.ts            # Main router configuration
│   └── trpc.ts           # tRPC configuration
└── tests/                # API tests
```

## Router Organization

### 1. Main Router (root.ts)

```typescript
export const appRouter = createTRPCRouter({
  inventory: inventoryRouter,
  shared: sharedRouter,
  utils: utilsRouter
})
```

### 2. Domain-Specific Routers

- `inventory/`: Warehouse and stock management functionality
- `shared/`: Shared functionality across modules
- `utils/`: General API utilities

## Implementation Patterns

### 1. Router Structure

```typescript
// inventory.router.ts
export const inventoryRouter = createTRPCRouter({
  getProductStock: protectedProcedure
    .input(
      z.object({
        productId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      return await getProductStock(ctx.db, input)
    })
})
```

### 2. Function Structure

```typescript
// inventory.funcs.ts
export async function getProductStock(
  db: DB,
  { productId }: { productId: string }
) {
  try {
    const stock = await db.query.InventoryTable.findFirst({
      where: (inventory, { eq }) => eq(inventory.productId, productId)
    })
    return stock
  } catch (error) {
    throw handleError(error, "Failed to fetch product stock")
  }
}
```

### 3. Error Handling

The error handling is done at the function level, with tRPC procedures focusing on orchestration. Here's a real example from our inventory transactions system:

```typescript
// Router level (inventory_transactions.router.ts)
createInventoryTransaction: protectedProcedure
  .input(
    z.union([
      inventoryTransactionsSchema.insert,
      z.array(inventoryTransactionsSchema.insert)
    ])
  )
  .mutation(async ({ ctx, input }) => {
    if (Array.isArray(input) && input.some(item => item.type === "transfer")) {
      return await createTransferInventoryTransaction(ctx.db, input)
    }
    return await createInventoryTransaction(ctx.db, input)
  })

// Function level (group-transactions.funcs.tsx)
export function transactionGroupToIndividualArray(
  groupTransactions: TransactionForm,
  groupId?: string,
  creating?: boolean
) {
  try {
    const newGroupId = groupId ?? nanoid()
    // ... business logic ...
    return transactions
  } catch (error) {
    throw handleError(error, "Failed to process transaction group")
  }
}
```

Key aspects of our error handling:

- Functions throw errors that are handled by tRPC's error handling
- Complex transformations are handled in separate functions
- Input validation using Zod schemas
- Clear error messages for debugging
- Error handling utility (`handleError`) for consistent error formatting

## Business Logic Functions (funcs/)

### 1. Function Organization

- Functions are organized by domain
- First parameter is always the database client
- Additional clients (Supabase, etc.) follow
- Input parameters are grouped in an object
- Consistent error handling

### 2. Naming Convention

- Files: `{domain}.{type}.ts`
  - Example: `inventory.funcs.ts`, `inventory.router.ts`
- Functions: descriptive and action-based
  - Example: `getProductStock`, `createPurchaseOrder`

## Best Practices

1. **Separation of Concerns**

   - Routers handle request orchestration
   - Functions contain business logic
   - Schema validation with Zod
   - Error handling in utils

2. **Endpoint Design**

   - One endpoint = one specific action
   - Focused and meaningful operations
   - Reusability when possible
   - Small and maintainable

3. **Security**

   - Use `protectedProcedure` for authenticated routes
   - Authorization at router level
   - Input validation with Zod
   - Secure context handling

4. **Performance**

   - Optimized database queries
   - Proper indexing
   - Monitoring response times
   - Caching when appropriate

5. **Testing**

   - Separate function testing
   - Router integration tests
   - Mock external services
   - Error scenario coverage

6. **Documentation**
   - Clear function documentation
   - Input/output type definitions
   - Error handling documentation
   - Usage examples

## Context and Authentication

```typescript
// Context structure
type Context = {
  db: DB // Database client
  supabase: SupabaseClient // Supabase client
  user?: User // Authenticated user
}

// Context usage in functions
export async function createOrder(
  db: DB,
  supabase: SupabaseClient,
  { orderId, items }: CreateOrderInput
) {
  // Business logic here
}
```

This structure ensures:

- Type safety through tRPC
- Clear separation of concerns
- Easy testing and maintenance
- Consistent error handling
- Scalable module organization

# API Structure Guidelines

## Function Organization

### 1. Directory Structure

```typescript
api/
├── src/
│   ├── funcs/              # Database functions
│   │   ├── module/         # Module-specific functions
│   │   │   ├── entity.funcs.ts
│   │   │   └── index.ts
│   ├── routes/             # API routes
│   │   ├── module/
│   │   │   ├── entity.route.ts
│   │   │   └── index.ts
```

### 2. Naming Conventions

- Files: `entityName.funcs.ts`
- Functions:
  - Get: `getEntity`, `getEntityBy[Field]`
  - Add: `addEntity`
  - Update: `updateEntity`
  - Remove: `removeEntity`
  - List: `getEntities`

### 3. Function Structure

```typescript
/**
 * @function getFunctionName
 * @description Purpose of the function
 *
 * @param {DBClient} db - Database client
 * @param {Object} params - Function parameters
 * @returns {Promise<ReturnType>} Description of return value
 */
export async function getFunctionName(
  db: DBClient,
  params: ParamsType
): Promise<ReturnType> {
  // Implementation
}
```

## Query Patterns

### 1. Drizzle ORM Query Methods

#### Relational Queries (Preferred for Simple Queries)

```typescript
// Use when no complex joins or nested filtering needed
// IMPORTANT: All relation names MUST start with underscore (_)
const result = await db.query.MainTable.findMany({
  with: {
    _relation: true,
    _nestedRelation: {
      with: {
        _deeperRelation: true
      }
    }
  },
  where: (table, { eq }) => eq(table.field, value)
})
```

#### JSON/JSONB Column Handling

```typescript
// In schema file
const table = pgTable("example", {
  metadata: jsonb("metadata").$type<Record<string, unknown>>()
})

// In adjustment schema
const adjustSchema = {
  metadata: z.record(z.string(), z.unknown()) // Proper type for jsonb columns
}

// Usage in functions
const data = {
  metadata: {
    key: "value",
    nested: { foo: "bar" }
  }
}
```

### 2. Relations Configuration

#### Naming Convention

```typescript
// All relation names MUST start with underscore (_)
export const tableRelations = relations(Table, ({ one, many }) => ({
  _parent: one(ParentTable, {
    fields: [Table.parentId],
    references: [ParentTable.id]
  }),
  _children: many(ChildTable),
  _manyToMany: many(RelatedTable)
}))
```

#### Relation Usage in Queries

```typescript
const result = await db.query.Table.findFirst({
  with: {
    _parent: true, // Simple relation
    _children: {
      // Nested relation
      with: {
        _grandChildren: true
      }
    },
    _manyToMany: {
      // Many-to-many relation
      with: {
        _throughTable: true
      }
    }
  }
})
```

## Pagination Strategies

### 1. Cursor-Based Pagination (Preferred for Large Lists)

```typescript
const getItemsInfinite = async (cursor?: string, limit: number = 20) => {
  return db
    .select()
    .from(items)
    .where(cursor ? gt(items.id, cursor) : undefined)
    .limit(limit + 1)
    .orderBy(asc(items.id))
}
```

### 2. Regular Pagination (For Admin Interfaces)

```typescript
const getItemsPaginated = async (page: number = 1, limit: number = 20) => {
  const offset = (page - 1) * limit
  return db.select().from(items).limit(limit).offset(offset)
}
```

### 3. No Pagination (For Small Lists)

```typescript
// Use for tables with few records (e.g., departments, categories)
const getAllDepartments = async () => {
  return db.query.departments.findMany()
}
```

## Best Practices

1. **Validation**

   - Always validate input parameters
   - Use schema validation (Zod/TypeBox)
   - Handle edge cases explicitly

2. **Error Handling**

   - Use consistent error patterns
   - Provide meaningful error messages
   - Log errors appropriately

3. **Performance**

   - Use appropriate pagination strategy
   - Optimize queries for large datasets
   - Consider caching strategies

4. **Type Safety**
   - Use TypeScript types/interfaces
   - Leverage Drizzle's type inference
   - Document complex types

## Integration with React Query

1. **Infinite Queries**

```typescript
// Backend function
const getMessagesInfinite = async (cursor?: string) => {
  const items = await db.query.messages.findMany({
    take: 20,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: "desc" }
  })
  return {
    items,
    nextCursor: items.length === 20 ? items[items.length - 1].id : undefined
  }
}

// Frontend usage with React Query
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ["messages"],
  queryFn: ({ pageParam }) => getMessagesInfinite(pageParam),
  getNextPageParam: lastPage => lastPage.nextCursor
})
```

2. **Regular Queries**

```typescript
// For simple data fetching without pagination
const { data } = useQuery({
  queryKey: ["departments"],
  queryFn: () => getAllDepartments()
})
```

## Documentation

- Each function should have JSDoc comments
- Document complex query patterns
- Provide usage examples
- Reference related documentation in `/docs`
