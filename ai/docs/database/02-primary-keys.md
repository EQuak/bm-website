# Primary Keys and UUIDs

## UUIDv7 vs UUID Random

This project uses two types of UUIDs for primary keys:

### 1. UUIDv7 (Recommended for Most Tables)

```typescript
id: d.uuid("id")
  .primaryKey()
  .$defaultFn(() => uuidv7())
```

Benefits:

- Combines timestamp with randomness
- Natural ordering by creation time
- Ideal for cursor-based pagination
- Better for database indexing
- Recommended for most tables

### 2. UUID Random (Special Cases)

```typescript
id: d.uuid("id").primaryKey().defaultRandom()
```

Benefits:

- Simpler implementation
- Lower overhead
- Completely random distribution
- Good for junction tables

## Usage Guidelines

### When to Use UUIDv7

- Main entity tables (users, orders, etc.)
- Tables that need temporal ordering
- Tables with frequent range queries
- Tables requiring cursor pagination
- Tables that might need replication

```typescript
export const OrdersTable = pgTable("orders", {
  id: d
    .uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7())
  // ... other columns
})
```

### When to Use Random UUID

- Junction/pivot tables
- Simple relationship tables
- Tables without ordering requirements
- Tables with infrequent writes

```typescript
export const UserRolesTable = pgTable("userRoles", {
  id: d.uuid("id").primaryKey().defaultRandom()
  // ... other columns
})
```

## Best Practices

1. **Consistency**

   - Use UUIDv7 as the default choice
   - Document when using random UUIDs
   - Keep ID generation consistent within related tables
   - Consider indexing strategy

2. **Performance**

   - Index UUIDs appropriately
   - Consider clustering when using UUIDv7
   - Monitor index size and performance
   - Use appropriate UUID type for the use case

3. **Type Safety**

   - Always use TypeScript types
   - Validate UUIDs at schema level
   - Handle UUID generation errors
   - Use proper UUID validation

4. **Migration Considerations**

   - Plan UUID type changes carefully
   - Consider data migration impact
   - Test performance implications
   - Document UUID strategy changes

This structure ensures:

- Consistent ID generation
- Optimal database performance
- Proper data organization
- Future-proof design
- Easy maintenance
