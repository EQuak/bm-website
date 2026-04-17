# Indices and Performance

## Index Definition

Define indices along with table definitions:

```typescript
export const InventoryTable = pgTable(
  "inventory",
  {
    id: d
      .uuid("id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    itemSku: d.text("itemSku").notNull(),
    locationId: d
      .uuid("locationId")
      .references(() => LocationTable.id)
      .notNull()
  },
  table => ({
    // Single-column index
    skuIdx: index("inventory_item_sku_idx").on(table.itemSku),
    // Composite index
    locationSkuIdx: index("inventory_location_sku_idx").on(
      table.locationId,
      table.itemSku
    )
  })
)
```

## Naming Conventions

### 1. Index Names

- Format: `{tableName}_{columns}_idx`
- Unique indices: `{tableName}_{columns}_unique`
- Composite indices: `{tableName}_{column1}_{column2}_idx`

```typescript
// Examples
"inventory_item_sku_idx"
"users_email_unique"
"orders_user_status_idx"
```

### 2. Index Types

```typescript
// Regular Index
index("transactions_date_idx").on(table.createdAt)

// Unique Index
uniqueIndex("users_email_unique").on(table.email)

// Composite Index
index("inventory_location_item_idx").on(table.locationId, table.itemId)

// Partial Index
index("active_users_idx")
  .on(table.email)
  .where(sql`status = 'active'`)
```

## Index Strategy

### 1. When to Create Indices

- Foreign key columns
- Frequently queried columns
- Sorting columns
- Unique constraint columns
- Search fields

```typescript
export const OrdersTable = pgTable(
  "orders",
  {
    id: d
      .uuid("id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    userId: d.uuid("userId").references(() => UserTable.id),
    status: d.text("status"),
    orderNumber: d.text("orderNumber")
  },
  table => ({
    // Index for foreign key
    userIdx: index("orders_user_idx").on(table.userId),
    // Index for frequent queries
    statusIdx: index("orders_status_idx").on(table.status),
    // Unique constraint
    orderNumberUnique: uniqueIndex("orders_number_unique").on(table.orderNumber)
  })
)
```

### 2. Composite Index Considerations

- Column order matters
- Most selective column first
- Consider query patterns
- Match WHERE clause order

```typescript
// Good: Most selective first
index("inventory_sku_location_idx").on(table.itemSku, table.locationId)

// Less Effective: Less selective first
index("inventory_location_sku_idx").on(table.locationId, table.itemSku)
```

## Full Example

## Best Practices

1. **Performance Monitoring**

   - Monitor index usage
   - Check query performance
   - Review execution plans
   - Maintain index statistics

2. **Index Maintenance**

   - Remove unused indices
   - Update statistics regularly
   - Consider rebuild/reorganize
   - Monitor index fragmentation

3. **Design Considerations**

   - Balance between read/write
   - Consider storage impact
   - Evaluate maintenance overhead
   - Plan for data growth

4. **Query Optimization**

   - Match index column order
   - Use covering indices
   - Consider partial indices
   - Monitor query patterns

## Implementation Examples

### 1. Complex Search Index

```typescript
export const ProductsTable = pgTable(
  "products",
  {
    id: d
      .uuid("id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    name: d.text("name").notNull(),
    category: d.text("category"),
    status: d.text("status").default("active")
  },
  table => ({
    // Composite index for search
    searchIdx: index("products_search_idx").on(
      table.category,
      table.name,
      table.status
    ),
    // Partial index for active products
    activeIdx: index("products_active_idx")
      .on(table.status)
      .where(sql`status = 'active'`)
  })
)
```

### 2. Performance-Optimized Indices

```typescript
export const TransactionsTable = pgTable(
  "transactions",
  {
    id: d
      .uuid("id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    userId: d.uuid("userId").references(() => UserTable.id),
    amount: d.decimal("amount", { precision: 10, scale: 2 }),
    createdAt: d.timestamp("createdAt").defaultNow()
  },
  table => ({
    // Index for date range queries
    dateIdx: index("transactions_date_idx").on(table.createdAt),
    // Composite index for user transactions
    userDateIdx: index("transactions_user_date_idx").on(
      table.userId,
      table.createdAt
    )
  })
)
```

This structure ensures:

- Optimal query performance
- Efficient data retrieval
- Proper index maintenance
- Scalable database design
- Clear naming conventions
