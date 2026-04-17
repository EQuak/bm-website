# Schema Validation

## Schema Structure

This project uses a combination of Drizzle and Zod for comprehensive schema validation:

### 1. Base Schema Definition

```typescript
// Table Definition
export const InventoryTable = pgTable("inventory", {
  id: d
    .uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  itemSku: d.text("itemSku").notNull(),
  quantity: d.integer("quantity").notNull().default(0),
  minQuantity: d.integer("minQuantity").notNull().default(0),
  locationId: d
    .uuid("locationId")
    .references(() => LocationTable.id)
    .notNull()
})

// Custom Validation Rules
const adjustmentSchema = {
  quantity: z.coerce
    .number()
    .int("Quantity must be an integer")
    .min(0, "Quantity cannot be negative"),
  minQuantity: z.coerce
    .number()
    .int("Minimum quantity must be an integer")
    .min(0, "Minimum quantity cannot be negative")
}

// Schema Composition
export const InventoryTableSchemas = {
  insert: createInsertSchema(InventoryTable, adjustmentSchema),
  select: createSelectSchema(InventoryTable),
  update: createInsertSchema(InventoryTable, adjustmentSchema)
}
```

### 2. Extended Validation

```typescript
// Extended Schema with Custom Rules
export const inventoryFormSchema = z.object({
  data: InventoryTableSchemas.insert.extend({
    itemSku: z.string().min(1, "SKU is required"),
    quantity: z.number().min(0, "Quantity must be positive")
  }),
  states: z.object({
    loading: z.boolean(),
    inventory: z.optional(z.any())
  })
})
```

## Validation Patterns

### 1. Form Validation

```typescript
const form = useForm<InventoryFormType>({
  validate: mtnZodResolver(inventoryFormSchema),
  initialValues: {
    data: {
      itemSku: "",
      quantity: 0,
      minQuantity: 0,
      locationId: ""
    },
    states: {
      loading: false
    }
  }
})
```

### 2. API Validation

```typescript
export const inventoryRouter = createTRPCRouter({
  createInventory: protectedProcedure
    .input(InventoryTableSchemas.insert)
    .mutation(async ({ ctx, input }) => {
      const parsed = InventoryTableSchemas.insert.parse(input)
      return await createInventory(ctx.db, parsed)
    })
})
```

### 3. Enum Validation

```typescript
// Define enum with values and labels
export const TICKET_STATUS = {
  DRAFT: { value: "DRAFT", label: "Draft" },
  OPEN: { value: "OPEN", label: "Open" }
} as const

// Create Zod enum schema
export const ticketStatusSchema = z.enum(
  Object.values(TICKET_STATUS).map(status => status.value) as [
    keyof typeof TICKET_STATUS,
    ...(keyof typeof TICKET_STATUS)[]
  ]
)

// Use in form validation
export const ticketFormSchema = z.object({
  data: TicketTableSchemas.insert.extend({
    status: ticketStatusSchema.default(TICKET_STATUS.DRAFT.value)
  })
})

// Validate in API
export const updateTicketStatus = protectedProcedure
  .input(
    z.object({
      id: z.string().uuid(),
      status: ticketStatusSchema
    })
  )
  .mutation(async ({ ctx, input }) => {
    return await updateTicket(ctx.db, input)
  })
```

## Best Practices

1. **Schema Organization**

   - Keep schemas close to table definitions
   - Use consistent naming patterns
   - Separate business logic validation
   - Document complex validations

2. **Type Safety**

   - Leverage Zod's type inference
   - Use TypeScript everywhere
   - Define clear error messages
   - Handle edge cases

3. **Validation Layers**

   - Client-side form validation
   - API endpoint validation
   - Database constraint validation
   - Business logic validation

4. **Error Handling**

   - Provide clear error messages
   - Handle validation errors gracefully
   - Log validation failures
   - Return appropriate error responses

## Implementation Examples

### 1. Complex Form Validation

```typescript
export const userFormSchema = z.object({
  data: UserTableSchemas.insert
    .extend({
      email: z.string().email("Invalid email format"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[0-9]/, "Password must contain a number")
        .regex(/[A-Z]/, "Password must contain an uppercase letter"),
      confirmPassword: z.string()
    })
    .refine(data => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"]
    })
})
```

### 2. Conditional Validation

```typescript
export const orderSchema = z.object({
  data: OrderTableSchemas.insert.extend({
    shippingAddress: z
      .string()
      .optional()
      .refine(addr => !needsShipping || !!addr, {
        message: "Shipping address is required for physical items"
      })
  })
})
```

This structure ensures:

- Consistent validation
- Type safety
- Clear error messages
- Maintainable code
- Robust data integrity
