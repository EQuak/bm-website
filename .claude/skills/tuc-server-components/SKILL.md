---
name: server-components
description: Next.js Server Component patterns for this monorepo. Use when creating server pages and components. Covers tRPC prefetch with HydrateClient, async params handling, data hydration, permission checks, and minimal UI logic in server components.
---

# Server component patterns

## Overview

Server Components are the default in Next.js App Router. Use them for data fetching, permission checks, and passing data to Client Components.

## Basic Server Page Structure

```typescript
import { api, HydrateClient } from "#/trpc/server"
import ClientComponent from "./_components/ClientComponent"

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Prefetch data on server
  void (await api.items.getById.prefetch({ id }))

  return (
    <HydrateClient>
      <ClientComponent id={id} />
    </HydrateClient>
  )
}
```

## Critical Rules

### ALWAYS DO:
- Export page components as `default`
- Await `params` (they are Promises in Next.js 15)
- Use `api.*.prefetch()` for data that clients will use
- Wrap client components with `<HydrateClient>`
- Keep UI logic minimal in server components
- Do permission checks before rendering

### NEVER DO:
- Add `"use client"` to server components
- Use hooks (`useState`, `useEffect`) in server components
- Add event handlers (`onClick`) in server components
- Pass hydrated data as props (it's already hydrated)
- Skip `await` on params

## When to Use Server vs Client

### Use Server Components When:
- No reactivity needed
- Primarily doing data fetching
- Keeping sensitive logic on server
- Reducing client-side JavaScript

### Use Client Components When:
- Interactivity needed (`onClick`, `onChange`)
- React hooks required (`useState`, `useEffect`)
- Browser APIs needed
- Component state/lifecycle needed

**Priority Rule**: Route pages (`page.tsx`) should be Server Components.

## Params Handling

```typescript
// params are ALWAYS Promises - must await
export default async function Page({
  params
}: {
  params: Promise<{ mode: ["create" | "edit", ...string[]] }>
}) {
  const { mode } = await params
  const action = mode[0]  // "create" or "edit"
  const id = mode[1]      // optional id

  // Use params after awaiting
}
```

## Data Prefetching Patterns

### Single Prefetch
```typescript
export default async function ItemPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  void (await api.items.getById.prefetch({ id }))

  return (
    <HydrateClient>
      <ItemDetails id={id} />
    </HydrateClient>
  )
}
```

### Multiple Prefetches
```typescript
export default async function DashboardPage() {
  // Prefetch multiple queries
  void (await api.users.getAll.prefetch())
  void (await api.posts.getRecent.prefetch())
  void (await api.stats.getSummary.prefetch())

  return (
    <HydrateClient>
      <Dashboard />
    </HydrateClient>
  )
}
```

### Conditional Prefetching
```typescript
export default async function ItemsPage({
  params
}: {
  params: Promise<{ mode: ["create" | "edit" | "view" | "list", ...string[]] }>
}) {
  const mode = (await params).mode[0]
  const sku = (await params).mode[1]

  if (mode === "list") {
    void (await api.inventory.items.getItems.prefetch())
    void (await api.inventory.items.getItemsWithSearchAndFilters.prefetch({}))
    return (
      <HydrateClient>
        <ItemsList />
      </HydrateClient>
    )
  }

  // Edit/view mode
  void (await api.inventory.items.getItemBySku.prefetch({ sku }))
  return (
    <HydrateClient>
      <ItemForm mode={mode} sku={sku} />
    </HydrateClient>
  )
}
```

## Permission Checks

```typescript
import { redirect } from "next/navigation"
import { api } from "#/trpc/server"

export default async function AdminPage() {
  const user = await api.auth.getCurrentUser()

  // Check permissions before rendering
  if (!user || user.role !== "admin") {
    redirect("/unauthorized")
  }

  void (await api.admin.getDashboard.prefetch())

  return (
    <HydrateClient>
      <AdminDashboard />
    </HydrateClient>
  )
}
```

## Layout Pattern

Server components define general structure; client components handle visual composition:

```typescript
// page.tsx (Server Component)
export default async function ProjectPage({
  params
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params

  void (await api.projects.getById.prefetch({ id: projectId }))
  void (await api.projects.getMembers.prefetch({ projectId }))

  return (
    <HydrateClient>
      <div className="flex h-screen">
        {/* Structure defined here */}
        <aside className="w-64">
          <ProjectSidebar projectId={projectId} />
        </aside>
        <main className="flex-1">
          <ProjectContent projectId={projectId} />
        </main>
      </div>
    </HydrateClient>
  )
}
```

## Hydration Notes

If data has been hydrated on the server via `prefetch()`:
- **No need to pass as props** - Client can use `useSuspenseQuery`
- Data is automatically available in client cache

```typescript
// Server Component
void (await api.items.getById.prefetch({ id }))

return (
  <HydrateClient>
    <ItemDetails id={id} />  {/* Only pass the ID */}
  </HydrateClient>
)

// Client Component
function ItemDetails({ id }: { id: string }) {
  // Data is already hydrated - no loading state
  const [item] = api.items.getById.useSuspenseQuery({ id })
  return <div>{item.name}</div>
}
```

## Full Example

```typescript
import { api, HydrateClient } from "#/trpc/server"
import { redirect } from "next/navigation"
import ItemForm from "./_components/form/ItemForm"
import ItemsList from "./_components/list/ItemsList"

export default async function ItemsPage({
  params
}: {
  params: Promise<{ mode: ["create" | "edit" | "view" | "list", ...string[]] }>
}) {
  // 1. Await params
  const mode = (await params).mode[0]
  const sku = (await params).mode[1]

  // 2. Permission check (if needed)
  const user = await api.auth.getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  // 3. Conditional prefetching based on mode
  if (mode === "list") {
    void (await api.inventory.items.getItems.prefetch())
    void (await api.inventory.items.getItemsWithSearchAndFilters.prefetch({}))

    return (
      <HydrateClient>
        <ItemsList />
      </HydrateClient>
    )
  }

  // 4. Edit/View/Create mode
  if (mode !== "create" && sku) {
    void (await api.inventory.items.getItemBySku.prefetch({ sku }))
  }

  return (
    <HydrateClient>
      <ItemForm mode={mode} sku={sku} />
    </HydrateClient>
  )
}
```

## Server Actions vs tRPC

For mutations, prefer tRPC over Server Actions for consistency:

```typescript
// Prefer tRPC in Client Components
const mutation = api.items.create.useMutation()

// Instead of Server Actions
async function createItem(formData: FormData) {
  "use server"
  // ...
}
```
