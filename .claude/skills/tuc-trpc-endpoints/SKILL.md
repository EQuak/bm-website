---
name: trpc-endpoints
description: tRPC endpoint patterns for this monorepo. Use when creating tRPC router endpoints with Drizzle ORM. Covers protectedProcedure, publicProcedure, ctx usage (db, user, supabase), Zod validation, query vs mutation, error handling, and performance patterns.
---

# tRPC endpoint patterns

## Router Structure

```typescript
import { createTRPCRouter, protectedProcedure, publicProcedure } from "#/server/api/trpc";
import { z } from "zod";
import { eq, ilike, and } from "drizzle-orm";
import { ExampleTable, exampleSchemas } from "@repo/db/schema";

export const exampleRouter = createTRPCRouter({
  // Queries and mutations here
});
```

## Critical Rules

### ALWAYS DO:
- Use `protectedProcedure` for authenticated routes
- Validate input with Zod schemas
- Use consistent response format: `{ data, error }`
- Use table schemas from `*.table.ts` when possible
- Handle errors with try/catch
- Use `ctx.db` for database operations

### NEVER DO:
- Use `publicProcedure` for sensitive operations
- Skip input validation
- Return raw errors to client
- Mix query and mutation concerns

## Available Context

```typescript
// Inside any procedure:
.query(async ({ ctx, input }) => {
  ctx.db          // Drizzle client
  ctx.user        // Auth logged user
  ctx.supabase    // Supabase server client
  ctx.supabaseAdmin // Supabase admin client
})
```

## Protected vs Public Procedures

```typescript
// Protected - requires authentication
export const getProfile = protectedProcedure
  .query(async ({ ctx }) => {
    return ctx.db.query.ProfilesTable.findFirst({
      where: eq(ProfilesTable.id, ctx.user.id)
    });
  });

// Public - no auth required (login, registration, public data)
export const getPublicData = publicProcedure
  .query(async ({ ctx }) => {
    return ctx.db.query.PublicTable.findMany();
  });
```

## Input Validation

### Using Table Schemas (Preferred)
```typescript
import { profilesSchema } from "@repo/db/schema";

export const createProfile = protectedProcedure
  .input(profilesSchema.insert.pick({ first_name: true, email: true }))
  .mutation(async ({ ctx, input }) => {
    // input is typed and validated
  });
```

### Using Inline Zod Schema
```typescript
export const searchItems = protectedProcedure
  .input(z.object({
    search: z.string(),
    limit: z.number().optional().default(10)
  }))
  .query(async ({ ctx, input }) => {
    // ...
  });
```

## Query Pattern

```typescript
export const searchItems = protectedProcedure
  .input(z.object({
    search: z.string(),
    limit: z.number().optional().default(10)
  }))
  .query(async ({ ctx, input }) => {
    const { search } = input;

    // Early validation
    if (search.length < 3) {
      return { data: [], error: null };
    }

    try {
      const items = await ctx.db.query.ItemsTable.findMany({
        where: (items, { ilike, and }) =>
          and(
            ilike(items.part_number, `%${search}%`),
            ilike(items.description, `%${search}%`)
          ),
        limit: input.limit
      });

      return { data: items, error: null };
    } catch (error) {
      console.error(error);
      return { data: [], error };
    }
  });
```

## Mutation Pattern

```typescript
export const updateUser = protectedProcedure
  .input(z.object({
    id: z.string().uuid(),
    data: userSchema.update.partial()
  }))
  .mutation(async ({ ctx, input }) => {
    try {
      const updated = await ctx.db
        .update(UsersTable)
        .set(input.data)
        .where(eq(UsersTable.id, input.id))
        .returning();

      return { data: updated[0], error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error };
    }
  });
```

## Complex Queries with Joins

```typescript
export const getItemWithDetails = protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ ctx, input }) => {
    const result = await ctx.db
      .select({
        item: ItemsTable,
        category: CategoriesTable,
        supplier: SuppliersTable
      })
      .from(ItemsTable)
      .leftJoin(CategoriesTable, eq(ItemsTable.category_id, CategoriesTable.id))
      .leftJoin(SuppliersTable, eq(ItemsTable.supplier_id, SuppliersTable.id))
      .where(eq(ItemsTable.id, input.id));

    return { data: result[0] ?? null, error: null };
  });
```

## Performance Optimization

### Parallel Queries
```typescript
export const getDashboardData = protectedProcedure
  .query(async ({ ctx }) => {
    const [users, posts, comments] = await Promise.all([
      ctx.db.select().from(UsersTable),
      ctx.db.select().from(PostsTable),
      ctx.db.select().from(CommentsTable)
    ]);

    return { data: { users, posts, comments }, error: null };
  });
```

### Transactions
```typescript
export const transferItem = protectedProcedure
  .input(z.object({
    itemId: z.string().uuid(),
    fromLocation: z.string().uuid(),
    toLocation: z.string().uuid()
  }))
  .mutation(async ({ ctx, input }) => {
    try {
      await ctx.db.transaction(async (tx) => {
        await tx.update(InventoryTable)
          .set({ quantity: sql`quantity - 1` })
          .where(and(
            eq(InventoryTable.item_id, input.itemId),
            eq(InventoryTable.location_id, input.fromLocation)
          ));

        await tx.update(InventoryTable)
          .set({ quantity: sql`quantity + 1` })
          .where(and(
            eq(InventoryTable.item_id, input.itemId),
            eq(InventoryTable.location_id, input.toLocation)
          ));
      });

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error };
    }
  });
```

## Supabase Operations

```typescript
export const uploadFile = protectedProcedure
  .input(z.object({ fileName: z.string(), bucket: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.storage
      .from(input.bucket)
      .createSignedUploadUrl(input.fileName);

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  });
```

## Full Router Example

```typescript
import { createTRPCRouter, protectedProcedure } from "#/server/api/trpc";
import { z } from "zod";
import { eq, ilike } from "drizzle-orm";
import { ItemsTable, itemsSchemas } from "@repo/db/schema";

export const inventoryItemsRouter = createTRPCRouter({
  getItems: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const items = await ctx.db.query.ItemsTable.findMany();
        return { data: items, error: null };
      } catch (error) {
        console.error(error);
        return { data: [], error };
      }
    }),

  getItemById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      try {
        const item = await ctx.db.query.ItemsTable.findFirst({
          where: eq(ItemsTable.id, input.id)
        });
        return { data: item, error: null };
      } catch (error) {
        console.error(error);
        return { data: null, error };
      }
    }),

  searchItems: protectedProcedure
    .input(z.object({
      search: z.string(),
      limit: z.number().optional().default(10)
    }))
    .query(async ({ ctx, input }) => {
      if (input.search.length < 3) {
        return { data: [], error: null };
      }

      try {
        const items = await ctx.db.query.ItemsTable.findMany({
          where: (items, { ilike }) =>
            ilike(items.part_number, `%${input.search}%`),
          limit: input.limit
        });
        return { data: items, error: null };
      } catch (error) {
        console.error(error);
        return { data: [], error };
      }
    }),

  createItem: protectedProcedure
    .input(itemsSchemas.insert)
    .mutation(async ({ ctx, input }) => {
      try {
        const [item] = await ctx.db
          .insert(ItemsTable)
          .values(input)
          .returning();
        return { data: item, error: null };
      } catch (error) {
        console.error(error);
        return { data: null, error };
      }
    }),

  updateItem: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: itemsSchemas.update.partial()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const [item] = await ctx.db
          .update(ItemsTable)
          .set(input.data)
          .where(eq(ItemsTable.id, input.id))
          .returning();
        return { data: item, error: null };
      } catch (error) {
        console.error(error);
        return { data: null, error };
      }
    }),

  deleteItem: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db
          .delete(ItemsTable)
          .where(eq(ItemsTable.id, input.id));
        return { data: { success: true }, error: null };
      } catch (error) {
        console.error(error);
        return { data: null, error };
      }
    })
});
```
