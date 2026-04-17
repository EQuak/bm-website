# CLAUDE.md — Monorepo web application template

> Guidance for AI agents and contributors working on this codebase.
> It is the single source of truth for project standards, patterns, and conventions.

## Project Overview

This is a **starter** Turborepo monorepo: Next.js (App Router), tRPC, Drizzle, Supabase Auth, and shared UI packages. Fork it for a product or internal app and replace placeholder naming/branding with your own.

### Business context

Customize this section for your product (domain, modules, compliance). The template ships with **auth, organizations, profiles, and settings** scaffolding only—add domain-specific tables and routes in your fork.

**Project goals and intention (your fork):** maintain [`docs/PROJECT_INTENT.md`](docs/PROJECT_INTENT.md). AI tools should read it alongside this file when scope or product direction matters.

## Tech Stack

| Category            | Technology                              |
| ------------------- | --------------------------------------- |
| **Framework**       | Next.js 15 (App Router)                 |
| **Frontend**        | React 19, Mantine UI v7, Tailwind CSS 4 |
| **Backend**         | Next.js API Routes, tRPC                |
| **Database**        | PostgreSQL via Drizzle ORM              |
| **Auth**            | Supabase Auth                           |
| **Real-time**       | Supabase Realtime                       |
| **Storage**         | Supabase Storage                        |
| **Background Jobs** | Trigger.dev                             |
| **Monitoring**      | (none)                                  |
| **Testing**         | Vitest (Unit), Playwright (E2E)         |
| **Package Manager** | pnpm                                    |
| **Build System**    | Turborepo (Monorepo)                    |
| **Linting/Format**  | ESLint, Prettier                        |

---

## Architecture

### Monorepo Structure

```
.
├── apps/
│   ├── web/                    # Main Next.js application
│   │   └── src/
│   │       ├── app/            # App Router pages
│   │       │   ├── (application)/app/  # Authenticated app routes
│   │       │   ├── (auth)/     # Authentication routes
│   │       │   └── api/        # API routes
│   │       ├── core/           # Core components, config, context
│   │       ├── hooks/          # Custom React hooks
│   │       ├── providers/      # React context providers
│   │       ├── stores/         # Zustand stores
│   │       ├── trpc/           # tRPC client configuration
│   │       └── utils/          # Utility functions
│   └── mobile/                 # React Native (Expo) mobile app
│
├── packages/
│   ├── api/                    # tRPC routers and business logic
│   │   └── src/
│   │       ├── funcs/          # Business logic functions (*.funcs.ts)
│   │       ├── router/         # tRPC routers (*.router.ts)
│   │       └── utils/          # Shared utilities
│   ├── db/                     # Drizzle ORM schemas and migrations
│   │   └── src/
│   │       ├── schema/         # Table definitions (*.table.ts)
│   │       ├── lib/            # Database utilities
│   │       └── seed/           # Seed data
│   ├── mantine-ui/             # Shared UI components
│   ├── react-email/            # Email templates
│   ├── tasks/                  # Trigger.dev background tasks
│   └── tailwind/               # Shared Tailwind config
│
├── ai/                         # AI-oriented docs (technical depth + learnings)
│   ├── docs/                   # How the stack is structured (API, DB, UI, architecture)
│   └── knowledge/              # Project knowledge base (learnings journal)
│
├── docs/                       # Template + product intent (fork onboarding)
│   ├── TEMPLATE.md             # What this repo is / fork workflow
│   └── PROJECT_INTENT.md       # Your fork’s goals (fill in; agents read this)
│
├── supabase/                   # Supabase configuration
│   └── migrations/             # Database migrations
│
└── tooling/                    # Shared tooling configs
    ├── eslint-config/
    ├── prettier-config/
    └── typescript-config/
```

### Route Group Conventions

| Group           | Purpose                                             |
| --------------- | --------------------------------------------------- |
| `(application)` | Authenticated app routes                            |
| `(auth)`        | Authentication flows                                |
| `(beta)`        | Features not production-ready                       |
| `[...mode]`     | Catch-all for CRUD modes (list, create, edit, view) |

---

## Coding Standards

### TypeScript Rules

```typescript
// ALWAYS
- Use strict TypeScript (no `any` without justification)
- Define explicit return types for functions
- Use Zod for runtime validation
- Leverage type inference from tRPC and Drizzle

// NEVER
- Use `as any`, `@ts-ignore`, `@ts-expect-error`
- Skip input validation
- Leave empty catch blocks
```

### Naming Conventions

| Element              | Convention                    | Example                         |
| -------------------- | ----------------------------- | ------------------------------- |
| Database columns     | `snake_case`                  | `first_name`, `created_at`      |
| Database tables      | `PascalCase` + `Table` suffix | `ProfilesTable`, `ItemsTable`   |
| TypeScript variables | `camelCase`                   | `firstName`, `itemList`         |
| React components     | `PascalCase`                  | `EmployeeCard`, `ItemForm`      |
| Files (components)   | `PascalCase.tsx`              | `EmployeeCard.tsx`              |
| Files (utilities)    | `camelCase.ts`                | `formatDate.ts`                 |
| Folders              | `kebab-case`                  | `employee-cards/`, `item-form/` |

### File Organization

```typescript
// Component structure
ComponentName/
├── ComponentName.tsx        # Main component
├── ComponentName.types.ts   # Types (if complex)
├── ComponentName.utils.ts   # Component-specific utilities
└── _components/             # Sub-components
    ├── SubComponent.tsx
    └── AnotherSub.tsx

// Page structure (App Router)
feature/
└── [...mode]/
    ├── page.tsx             # Server Component (entry point)
    └── _components/
        ├── form/            # Form components
        ├── list/            # List components
        └── view-form/       # View/edit components
```

### Comments

```typescript
/**
 * @file Description of the file's purpose
 * @module path/to/module
 */

/**
 * @component ComponentName
 * @description Brief description
 *
 * @example
 * <ComponentName prop1="value" />
 */

// TODO(#123): Description with ticket reference
```

---

## Database (Drizzle ORM)

### Table Definition Pattern

```typescript
import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { v7 as uuidv7 } from "uuid";
import { timestamps } from "@repo/db/utils";

// 1. Table Definition
export const ItemsTable = pgTable("items", (t) => ({
  id: t
    .uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: t.text("name").notNull(),
  category_id: t.uuid("category_id").references(() => CategoriesTable.id),
  is_active: t.boolean("is_active").default(true),
  ...timestamps, // Always include: created_at, updated_at
}));

// 2. Relations (MUST prefix with underscore)
export const _ItemsTableRelations = relations(ItemsTable, ({ one, many }) => ({
  _category: one(CategoriesTable, {
    fields: [ItemsTable.category_id],
    references: [CategoriesTable.id],
  }),
  _transactions: many(TransactionsTable),
}));

// 3. Schemas with optional refinements
export const itemsSchemas = {
  insert: createInsertSchema(ItemsTable),
  select: createSelectSchema(ItemsTable),
  update: createUpdateSchema(ItemsTable),
};

// 4. Types
export type Item = typeof ItemsTable.$inferSelect;
export type NewItem = typeof ItemsTable.$inferInsert;
```

### Critical Database Rules

```typescript
// ALWAYS
- Use snake_case for ALL column names
- Use PascalCase with Table suffix for table definitions
- Prefix relation names with underscore (_posts, _category)
- Prefix relation variable with underscore (_ItemsTableRelations)
- Use uuidv7() for primary keys
- Spread timestamps utility
- Export insert, select, update schemas

// NEVER
- Use camelCase for column names
- Create custom timestamp fields (use the utility)
- Define relations without underscore prefix
- Use uuid() instead of uuidv7()
```

---

## API Development (tRPC)

### Router Structure

```typescript
import { createTRPCRouter, protectedProcedure, publicProcedure } from "#/trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { ItemsTable, itemsSchemas } from "@repo/db/schema";

export const itemsRouter = createTRPCRouter({
  // Query - fetching data
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.ItemsTable.findMany();
  }),

  // Query with input
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.ItemsTable.findFirst({
        where: eq(ItemsTable.id, input.id),
      });
    }),

  // Mutation - modifying data
  create: protectedProcedure
    .input(itemsSchemas.insert)
    .mutation(async ({ ctx, input }) => {
      const [item] = await ctx.db.insert(ItemsTable).values(input).returning();
      return item;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: itemsSchemas.update.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [item] = await ctx.db
        .update(ItemsTable)
        .set(input.data)
        .where(eq(ItemsTable.id, input.id))
        .returning();
      return item;
    }),
});
```

### Available Context

```typescript
// Inside any procedure:
.query(async ({ ctx, input }) => {
  ctx.db           // Drizzle database client
  ctx.user         // Authenticated user (from Supabase Auth)
  ctx.supabase     // Supabase client (for storage, etc.)
  ctx.supabaseAdmin // Supabase admin client
})
```

### Procedure Types

| Type                 | Use Case                                            |
| -------------------- | --------------------------------------------------- |
| `protectedProcedure` | Requires authentication (most operations)           |
| `publicProcedure`    | No auth required (login, registration, public data) |

### Error Handling

```typescript
import { TRPCError } from "@trpc/server";

// In procedures - throw typed errors
if (!item) {
  throw new TRPCError({
    code: "NOT_FOUND",
    message: "Item not found",
  });
}

// In client components - handle errors
const mutation = api.items.create.useMutation({
  onSuccess: () => {
    notifications.show({ title: "Success", color: "green" });
  },
  onError: (error) => {
    notifications.show({
      title: "Error",
      message: error.message,
      color: "red",
    });
  },
});
```

---

## UI Development

### Server Components (Pages)

```typescript
// page.tsx - Server Component (default)
import { api, HydrateClient } from "#/trpc/server";
import { ClientComponent } from "./_components/ClientComponent";

export default async function ItemsPage({
  params,
}: {
  params: Promise<{ mode: string[] }>
}) {
  // 1. Await params (required in Next.js 15)
  const { mode } = await params;
  const action = mode[0];  // "list", "create", "edit", "view"
  const id = mode[1];      // Optional ID

  // 2. Prefetch data for client components
  if (action === "list") {
    void (await api.items.getAll.prefetch());
  } else if (id) {
    void (await api.items.getById.prefetch({ id }));
  }

  // 3. Wrap client components with HydrateClient
  return (
    <HydrateClient>
      <ClientComponent mode={action} id={id} />
    </HydrateClient>
  );
}
```

### Client Components

```typescript
"use client";

import { api } from "#/trpc/react";
import { useWorkspaceRouter } from "#/hooks/useWorkspaceRouter";

export function ItemsList() {
  const router = useWorkspaceRouter();

  // useSuspenseQuery returns [data, queryInfo] tuple
  const [items, itemsQuery] = api.items.getAll.useSuspenseQuery();

  const handleEdit = (id: string) => {
    router.push(`/items/edit/${id}`);
  };

  return (
    <Stack>
      {items.map((item) => (
        <Card key={item.id} onClick={() => handleEdit(item.id)}>
          {item.name}
        </Card>
      ))}
    </Stack>
  );
}
```

### Critical UI Rules

```typescript
// Server Components - ALWAYS
- Export as default
- Await params (they are Promises in Next.js 15)
- Use api.*.prefetch() for data
- Wrap client components with <HydrateClient>
- Do permission checks before rendering

// Client Components - ALWAYS
- Add "use client" at the top
- Destructure useSuspenseQuery as [data, queryInfo]
- Use useWorkspaceRouter for navigation (multi-tenant)

// Server Components - NEVER
- Add "use client"
- Use hooks (useState, useEffect)
- Add event handlers (onClick)

// Client Components - NEVER
- Expect useSuspenseQuery to return object (it returns a tuple!)
- Hardcode workspace URLs
```

---

## Forms (Mantine useForm)

### Basic Form Pattern

```typescript
"use client";

import { useForm } from "@mantine/form";
import { mtnZodResolver } from "@repo/mantine-ui";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
});

type FormType = z.infer<typeof schema>;

export function MyForm() {
  const form = useForm<FormType>({
    mode: "uncontrolled",  // Better performance
    validate: mtnZodResolver(schema),
    initialValues: {
      name: "",
      email: "",
    },
  });

  const handleSubmit = async (data: FormType) => {
    // Submit logic
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Name"
        {...form.getInputProps("name")}
        key={form.key("name")}  // Required in uncontrolled mode
      />
      <TextInput
        label="Email"
        {...form.getInputProps("email")}
        key={form.key("email")}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Form with Async Data

```typescript
"use client";

import { useEffect } from "react";
import { useForm } from "@mantine/form";

export function EditForm({ id }: { id: string }) {
  const [item] = api.items.getById.useSuspenseQuery({ id });

  const form = useForm({
    mode: "uncontrolled",
    validate: mtnZodResolver(schema),
    // Don't set initialValues for async data
  });

  // Initialize form when data is ready
  useEffect(() => {
    if (item) {
      form.initialize({
        name: item.name,
        email: item.email,
      });
    }
  }, [item]);

  return <form>...</form>;
}
```

### Critical Form Rules

```typescript
// ALWAYS
- Use mtnZodResolver for Zod validation
- Use form.key(fieldName) in uncontrolled mode
- Use form.getInputProps(fieldName) to bind inputs
- Use form.initialize() for async initial data

// NEVER
- Skip the key prop in uncontrolled mode
- Set async data in initialValues (use form.initialize)
```

---

## State Management

### Priority Order

1. **URL State (NUQS)** - For memoizable/shareable state

   ```typescript
   import { useQueryState } from "nuqs";
   const [search, setSearch] = useQueryState("search");
   ```

2. **Server State (React Query via tRPC)** - For server data

   ```typescript
   const [data] = api.items.getAll.useSuspenseQuery();
   ```

3. **Local State (useState)** - For component-specific UI state

   ```typescript
   const [isOpen, setIsOpen] = useState(false);
   ```

4. **Global State (Zustand)** - Only when truly needed
   ```typescript
   const store = useStore((state) => state.value);
   ```

---

## Tools & Integrations

### Issue tracking (optional)

If you use Linear, Jira, or GitHub Issues, document your team/project IDs and conventions here **for your fork**—do not commit internal IDs in the public template.

### Supabase

| Feature      | Use Case                                      |
| ------------ | --------------------------------------------- |
| **Auth**     | Phone OTP, Email OTP, password auth           |
| **Storage**  | File uploads with signed URLs                 |
| **Realtime** | Live subscriptions for collaborative features |
| **RLS**      | Row Level Security policies                   |

### Trigger.dev

Background jobs and scheduled tasks. See `/packages/tasks/CLAUDE.md` for patterns.

---

## Development Workflow

### Before Implementation

1. **Check existing patterns** - Look at similar features in codebase
2. **Check documentation** - `ai/docs/` has detailed guides
3. **Check database** - `packages/db/schema/` for table structures
4. **Check API** - `packages/api/src/` for existing endpoints

### When Implementing

1. **Database first** - Create/modify table if needed
2. **API second** - Add tRPC procedures
3. **UI last** - Build server page, then client components

### Commands

```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build all packages
pnpm lint                   # Run linting
pnpm typecheck              # TypeScript checking
pnpm test                   # Run tests

# Database
pnpm db:generate            # Generate migrations
pnpm db:push                # Push schema to database
pnpm db:studio              # Open Drizzle Studio
```

---

## Where to Find Help

| Need                        | Location                  |
| --------------------------- | ------------------------- |
| Product goals / intent (fork) | `docs/PROJECT_INTENT.md` |
| Detailed API documentation  | `ai/docs/api/`            |
| Database schema reference   | `ai/docs/database/`       |
| Architecture decisions      | `ai/docs/architecture/`   |
| UI component patterns       | `ai/docs/ui/`             |
| Project knowledge/learnings | `ai/knowledge/general.md` |
| Pattern examples (Claude)   | `.claude/skills/`         |
| Module-specific docs        | Nested `CLAUDE.md` files  |

### Nested CLAUDE.md Files

| Location                         | Content                      |
| -------------------------------- | ---------------------------- |
| `/apps/mobile/.../app/CLAUDE.md` | Expo / mobile app (if used) |
| `/packages/tasks/CLAUDE.md`      | Trigger.dev task patterns   |

---

## Quick Reference

### Creating a New Feature

```bash
# 1. Database table (if needed)
packages/db/src/schema/feature-name.table.ts

# 2. API functions
packages/api/src/funcs/feature-name.funcs.ts

# 3. API router
packages/api/src/router/feature-name.router.ts

# 4. UI pages
apps/web/src/app/(application)/app/feature-name/
├── [...mode]/
│   ├── page.tsx
│   └── _components/
│       ├── form/
│       └── list/
```

### File Naming

| Type      | Pattern          | Example           |
| --------- | ---------------- | ----------------- |
| Table     | `*.table.ts`     | `items.table.ts`  |
| Functions | `*.funcs.ts`     | `items.funcs.ts`  |
| Router    | `*.router.ts`    | `items.router.ts` |
| Component | `PascalCase.tsx` | `ItemCard.tsx`    |

---

## Best Practices

1. **Write self-documenting code** - Clear names over comments
2. **Follow DRY principles** - Extract reusable logic
3. **Implement proper TypeScript typing** - No shortcuts
4. **Keep components pure and focused** - Single responsibility
5. **Handle errors with user feedback** - Never silent failures
6. **Use consistent patterns** - Follow existing code
7. **Document complex logic** - JSDoc for non-obvious code
8. **Keep TODO comments with ticket references** - `// TODO(#123): ...`
9. **Test critical paths** - Unit tests for business logic
10. **Review before committing** - Self-review changes

---

## Thinking Process

When implementing a solution:

1. **Understand the problem** - What are we solving?
2. **Check existing code** - How is similar functionality implemented?
3. **Plan the approach** - Database → API → UI
4. **Implement incrementally** - Small, testable changes
5. **Verify the solution** - Does it work as expected?
6. **Document if needed** - Update docs for complex features
