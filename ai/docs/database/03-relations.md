# Table Relations

## Relation Patterns

This project follows specific patterns for defining table relations:

### 1. One-to-Many Relations

```typescript
export const InventoryTableRelations = relations(
  InventoryTable,
  ({ one, many }) => ({
    location: one(LocationTable, {
      fields: [InventoryTable.locationId],
      references: [LocationTable.id]
    }),
    transactions: many(TransactionTable, {
      fields: [InventoryTable.id],
      references: [TransactionTable.inventoryId]
    })
  })
)
```

### 2. One-to-One Relations

```typescript
export const ProfileTableRelations = relations(ProfileTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [ProfileTable.userId],
    references: [UserTable.id]
  })
}))
```

### 3. Many-to-Many Relations

```typescript
// Junction table
export const UserRolesTable = pgTable("userRoles", {
  userId: uuid("userId").references(() => UserTable.id),
  roleId: uuid("roleId").references(() => RoleTable.id)
})

// Relations
export const UserTableRelations = relations(UserTable, ({ many }) => ({
  roles: many(RoleTable, {
    through: UserRolesTable,
    fields: [UserTable.id],
    references: [RoleTable.id]
  })
}))
```

## Naming Conventions

### 1. Relation Names

- Use camelCase
- Be descriptive and clear
- Reflect the relationship type
- No underscore prefix

```typescript
// Good
user: one(UserTable)
transactions: many(TransactionTable)

// Avoid
_user: one(UserTable)
_transactions: many(TransactionTable)
```

### 2. Foreign Keys

- Use camelCase
- Include entity name and 'Id' suffix
- Be consistent across tables

```typescript
// Good
userId: uuid("userId")
locationId: uuid("locationId")

// Avoid
user_id: uuid("user_id")
location: uuid("location")
```

## Best Practices

1. **Type Safety**

   - Use TypeScript for type inference
   - Define proper foreign key constraints
   - Handle nullable relations
   - Validate relation integrity

2. **Performance**

   - Index foreign keys
   - Consider query patterns
   - Optimize join conditions
   - Monitor relation performance

3. **Consistency**

   - Follow naming conventions
   - Document complex relations
   - Maintain referential integrity
   - Use consistent patterns

4. **Query Optimization**

   - Consider eager loading
   - Use appropriate indexes
   - Optimize join queries
   - Monitor query performance

## Implementation Examples

### Complex Relations

```typescript
export const ProjectTableRelations = relations(
  ProjectTable,
  ({ one, many }) => ({
    // One-to-many relations
    owner: one(UserTable, {
      fields: [ProjectTable.ownerId],
      references: [UserTable.id]
    }),
    tasks: many(TaskTable, {
      fields: [ProjectTable.id],
      references: [TaskTable.projectId]
    }),
    // Many-to-many through junction
    members: many(UserTable, {
      through: ProjectMembersTable,
      fields: [ProjectTable.id],
      references: [UserTable.id]
    })
  })
)
```

### Nested Relations

```typescript
export const TaskTableRelations = relations(TaskTable, ({ one, many }) => ({
  project: one(ProjectTable, {
    fields: [TaskTable.projectId],
    references: [ProjectTable.id]
  }),
  assignee: one(UserTable, {
    fields: [TaskTable.assigneeId],
    references: [UserTable.id]
  }),
  comments: many(CommentTable)
}))
```

This structure ensures:

- Type-safe relations
- Consistent naming
- Efficient querying
- Clear documentation
- Maintainable codebase
