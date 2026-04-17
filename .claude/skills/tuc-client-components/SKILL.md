---
name: client-components
description: React client component patterns for this monorepo. Use when creating interactive components. Covers useSuspenseQuery destructuring, useWorkspaceRouter for multi-tenant navigation, Mantine + Tailwind styling, form component structure, and data fetching patterns.
---

# Client component patterns

## Overview

Client Components handle interactivity, hooks, and browser APIs. They receive hydrated data from Server Components via tRPC cache.

## Basic Structure

```typescript
"use client"

import { Flex, Stack, Button, Text } from "@repo/mantine-ui"
import { api } from "#/trpc/react"

interface Props {
  id: string
}

export default function MyComponent({ id }: Props) {
  // useSuspenseQuery returns [data, queryInfo]
  const [item, itemQuery] = api.items.getById.useSuspenseQuery({ id })

  return (
    <Stack>
      <Text>{item.name}</Text>
      <Button onClick={() => itemQuery.refetch()}>Refresh</Button>
    </Stack>
  )
}
```

## Critical Rules

### ALWAYS DO:
- Add `"use client"` at the top
- Destructure `useSuspenseQuery` as `[data, queryInfo]`
- Use `useWorkspaceRouter` for navigation (multi-tenant)
- Keep components single-purpose
- Use Mantine for basic styling, Tailwind for complex interactions

### NEVER DO:
- Expect `useSuspenseQuery` to return an object (it returns a tuple)
- Hardcode workspace URLs (use useWorkspaceRouter)
- Put entire pages in a single component
- Mix Server Component patterns with Client Components

## useSuspenseQuery Pattern

```typescript
"use client"

import { api } from "#/trpc/react"

export default function ItemDetails({ sku }: { sku: string }) {
  // CORRECT: Destructure as tuple [data, queryInfo]
  const [item, itemQuery] = api.inventory.items.getItemBySku.useSuspenseQuery({
    sku
  })

  // CORRECT: Multiple queries
  const [buildings] = api.inventory.buildings.getBuildings.useSuspenseQuery()

  // Access data directly
  const image = item?.mainImage ?? "/placeholder.png"

  // Access query info when needed
  const handleRefresh = () => {
    itemQuery.refetch()
  }

  return (
    <Stack>
      <Text>{item.name}</Text>
      <Button onClick={handleRefresh}>Refresh</Button>
    </Stack>
  )
}
```

## Multi-Tenant Navigation

```typescript
"use client"

import { useWorkspaceRouter } from "#/hooks/useWorkspaceRouter"

export default function Navigation() {
  // Use workspace router for dynamic links
  const router = useWorkspaceRouter()

  return (
    <Stack>
      {/* CORRECT: Dynamic workspace-aware links */}
      <Button onClick={() => router.push("/items")}>Items</Button>
      <Anchor component={Link} href={router.href("/settings")}>
        Settings
      </Anchor>

      {/* WRONG: Hardcoded URLs */}
      {/* <Link href="/workspace/items">Items</Link> */}
    </Stack>
  )
}
```

## Component Structure

Break down components by responsibility:

```
ItemPage/
├── ItemForm.tsx           # Main form (submission logic)
├── ItemFormFields.tsx     # Input fields
├── ItemFormActions.tsx    # Submit/Cancel buttons
├── ItemTable.tsx          # Data table
├── ItemTableActions.tsx   # Row actions
└── ItemTableFilters.tsx   # Filter controls
```

## Styling Approach

### Pure Mantine (simple cases)
```typescript
<Text fz="lg" fw={500} c="dimmed">
  Simple text styling
</Text>

<Stack gap="md" p="lg">
  <Text>Content</Text>
</Stack>
```

### Mixed Mantine + Tailwind (complex interactions)
```typescript
// Use Tailwind for pseudo-classes and conditionals
<Text
  fz="lg"
  className="hover:text-mtn-blue-5 transition-colors"
>
  Hover effect
</Text>

<Button
  className={cn(
    "hover:scale-105 transition-transform",
    isActive && "ring-2 ring-blue-500"
  )}
>
  Interactive Button
</Button>
```

### Pure Tailwind (unique UI)
```typescript
// For custom, non-reusable UI
<div className="relative flex h-[164px] w-full items-center justify-center overflow-hidden rounded-md bg-[#F5F5F5]">
  <Image src={image} alt="Preview" fill className="object-contain" />
</div>
```

## Form Component Pattern

### Main Form (handles logic)
```typescript
"use client"

import { useState } from "react"
import { useForm } from "@mantine/form"
import { ItemFormFields } from "./ItemFormFields"

export function ItemForm({ mode, sku }: { mode: string; sku?: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    initialValues: { name: "", quantity: 0 },
  })

  const handleSubmit = async (data: typeof form.values) => {
    setIsLoading(true)
    // submission logic
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <ItemFormFields form={form} isLoading={isLoading} />
    </form>
  )
}
```

### Fields Component (UI only)
```typescript
"use client"

import { TextInput, NumberInput, Stack } from "@repo/mantine-ui"

interface Props {
  form: UseFormReturnType<FormType>
  isLoading: boolean
}

export function ItemFormFields({ form, isLoading }: Props) {
  return (
    <Stack>
      <TextInput
        label="Name"
        disabled={isLoading}
        {...form.getInputProps("name")}
        key={form.key("name")}
      />
      <NumberInput
        label="Quantity"
        disabled={isLoading}
        {...form.getInputProps("quantity")}
        key={form.key("quantity")}
      />
    </Stack>
  )
}
```

## Data Fetching Patterns

### Preloaded Data (useSuspenseQuery)
```typescript
// Data prefetched on server, no loading state
const [items] = api.items.getAll.useSuspenseQuery()
```

### User-Triggered Fetching (useQuery)
```typescript
const { data, isLoading, refetch } = api.items.search.useQuery(
  { search: query },
  { enabled: query.length >= 3 }
)
```

### Mutations
```typescript
const createMutation = api.items.create.useMutation({
  onSuccess: () => {
    notifications.show({ title: "Created", color: "green" })
    utils.items.getAll.invalidate()
  },
  onError: (error) => {
    notifications.show({ title: "Error", message: error.message, color: "red" })
  },
})
```

## Full Example

```typescript
"use client"

import { Flex, Group, Stack, Button, Text } from "@repo/mantine-ui"
import Image from "next/image"
import { api } from "#/trpc/react"
import { useWorkspaceRouter } from "#/hooks/useWorkspaceRouter"

interface Props {
  sku: string
}

export default function ItemDetails({ sku }: Props) {
  const router = useWorkspaceRouter()

  // Correct useSuspenseQuery destructuring
  const [item, itemQuery] = api.inventory.items.getItemBySku.useSuspenseQuery({
    sku
  })

  const [buildings] = api.inventory.buildings.getBuildings.useSuspenseQuery()

  const deleteMutation = api.inventory.items.delete.useMutation({
    onSuccess: () => {
      router.push("/items")
    },
  })

  const image = item?.mainImage ?? "/placeholder.png"

  const handleDiscard = () => {
    deleteMutation.mutate({ sku })
  }

  return (
    <Flex direction="column" gap={8}>
      <Text fz={12} c="dimmed">Preview</Text>

      <Group>
        <Stack gap={0}>
          <Image
            className="relative flex h-[164px] w-full items-center justify-center overflow-hidden rounded-md bg-[#F5F5F5]"
            src={image}
            alt="Item Preview"
            width={120}
            height={120}
            style={{ objectFit: "contain" }}
          />
        </Stack>

        <Stack>
          <Text fw={500}>{item.name}</Text>
          <Text fz="sm" c="dimmed">SKU: {sku}</Text>
          <Text fz="sm">Buildings: {buildings.length}</Text>
        </Stack>

        <Button
          variant="light"
          color="red"
          onClick={handleDiscard}
          loading={deleteMutation.isPending}
        >
          Discard
        </Button>
      </Group>
    </Flex>
  )
}
```

## Left-Side Card Layout Pattern

For large forms, use a left-side summary card:

```typescript
<Flex gap="xl">
  {/* Left: Summary Card */}
  <Card w={300} withBorder>
    <Stack>
      <Text fw={500}>Summary</Text>
      <Text fz="sm">Name: {form.values.name}</Text>
      <Text fz="sm">Total: {calculateTotal()}</Text>
    </Stack>
  </Card>

  {/* Right: Main Form */}
  <Box flex={1}>
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {/* Form fields */}
    </form>
  </Box>
</Flex>
```
