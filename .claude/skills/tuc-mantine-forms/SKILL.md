---
name: mantine-forms
description: Mantine useForm patterns for this monorepo. Use when creating forms with Mantine hooks. Covers getInputProps, form.key for uncontrolled mode, form context, Zod validation with mtnZodResolver, form.initialize for async data, and submitting state handling.
---

# Mantine useForm patterns

## Overview

Mantine useForm is tightly integrated with Mantine UI components. Use `getInputProps` to bind form state directly - no additional controller needed.

## Basic Setup

```typescript
"use client"

import { useForm } from "@mantine/form"
import { mtnZodResolver } from "@repo/mantine-ui"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
})

type FormType = z.infer<typeof schema>

export function MyForm() {
  const form = useForm<FormType>({
    mode: "uncontrolled", // Better performance
    validate: mtnZodResolver(schema),
    initialValues: {
      name: "",
      email: "",
    },
  })

  const handleSubmit = async (data: FormType) => {
    console.log(data)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Name"
        {...form.getInputProps("name")}
        key={form.key("name")}
      />
      <TextInput
        label="Email"
        {...form.getInputProps("email")}
        key={form.key("email")}
      />
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Critical Rules

### ALWAYS DO:
- Use `mtnZodResolver` for Zod validation
- Use `form.key(fieldName)` in uncontrolled mode
- Use `form.getInputProps(fieldName)` to bind inputs
- Use `form.onSubmit(handleSubmit, handleErrors)` for submission
- Use `form.initialize()` for async initial data
- Destructure form from context when using FormProvider

### NEVER DO:
- Use React Hook Form Controller (use getInputProps instead)
- Skip the `key` prop in uncontrolled mode
- Initialize async data in initialValues (use form.initialize)
- Call form methods without proper null checks

## Uncontrolled Mode (Recommended)

Uncontrolled mode stores values in refs, preventing re-renders:

```typescript
const form = useForm({
  mode: "uncontrolled",
  initialValues: { name: "", email: "" },
})

// MUST use key prop in uncontrolled mode
<TextInput
  {...form.getInputProps("name")}
  key={form.key("name")}
/>
```

## Form with Async Initial Data

```typescript
"use client"

import { useEffect } from "react"
import { useForm } from "@mantine/form"
import { mtnZodResolver } from "@repo/mantine-ui"

export function EditForm({ itemId }: { itemId: string }) {
  const [item] = api.items.getById.useSuspenseQuery({ id: itemId })

  const form = useForm({
    mode: "uncontrolled",
    validate: mtnZodResolver(schema),
    // Don't set initialValues for async data
  })

  // Initialize form when data is ready
  useEffect(() => {
    if (item) {
      form.initialize({
        name: item.name,
        email: item.email,
      })
    }
  }, [item])

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {/* form fields */}
    </form>
  )
}
```

## Form Context for Complex Forms

### Create Context
```typescript
// ticket-form.context.ts
import { createFormContext } from "@mantine/form"

export type TicketFormType = {
  subject: string
  description: string
  priority: "low" | "medium" | "high"
}

export const [TicketFormProvider, useTicketFormContext, useTicketForm] =
  createFormContext<TicketFormType>()
```

### Use Context
```typescript
// TicketForm.tsx
"use client"

import { TicketFormProvider, useTicketForm } from "./ticket-form.context"
import { ticketFormSchema } from "./ticket-form.type"

export function TicketForm() {
  const form = useTicketForm({
    validate: mtnZodResolver(ticketFormSchema),
    initialValues: {
      subject: "",
      description: "",
      priority: "medium",
    },
  })

  return (
    <TicketFormProvider form={form}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TicketFormFields />
        <TicketFormActions />
      </form>
    </TicketFormProvider>
  )
}

// TicketFormFields.tsx
function TicketFormFields() {
  const form = useTicketFormContext()

  return (
    <Stack>
      <TextInput
        label="Subject"
        {...form.getInputProps("subject")}
        key={form.key("subject")}
      />
      <Textarea
        label="Description"
        {...form.getInputProps("description")}
        key={form.key("description")}
      />
    </Stack>
  )
}
```

## Error Handling

```typescript
const handleSubmit = async (data: FormType) => {
  try {
    await api.items.create.mutateAsync(data)
    notifications.show({
      title: "Success",
      message: "Item created",
      color: "green",
    })
  } catch (error) {
    notifications.show({
      title: "Error",
      message: "Failed to create item",
      color: "red",
    })
  }
}

const handleSubmitErrors = (errors: typeof form.errors) => {
  console.error("Validation errors:", errors)
  notifications.show({
    title: "Validation Error",
    message: "Please check the form fields",
    color: "red",
  })
}

<form onSubmit={form.onSubmit(handleSubmit, handleSubmitErrors)}>
```

## Form Status and States

```typescript
const form = useForm({
  // ...config
})

// Check form status
form.isDirty()           // Has any field changed?
form.isDirty("name")     // Has specific field changed?
form.isTouched()         // Has any field been touched?
form.isTouched("name")   // Has specific field been touched?
form.isValid()           // Is form valid?
form.isValid("name")     // Is specific field valid?

// Submitting state
<Button type="submit" loading={form.submitting}>
  Submit
</Button>
```

## Disable Fields During Loading

```typescript
const form = useForm({
  validate: mtnZodResolver(schema),
  enhanceGetInputProps: () => ({
    disabled: isLoading,
  }),
})

// All fields will be disabled when isLoading is true
<TextInput {...form.getInputProps("name")} />
```

## Dynamic List Fields

```typescript
const form = useForm({
  initialValues: {
    items: [{ name: "", quantity: 0 }],
  },
})

// Add item
form.insertListItem("items", { name: "", quantity: 0 })

// Remove item
form.removeListItem("items", index)

// Render list
{form.values.items.map((item, index) => (
  <Group key={form.key(`items.${index}`)}>
    <TextInput
      {...form.getInputProps(`items.${index}.name`)}
      key={form.key(`items.${index}.name`)}
    />
    <NumberInput
      {...form.getInputProps(`items.${index}.quantity`)}
      key={form.key(`items.${index}.quantity`)}
    />
    <ActionIcon onClick={() => form.removeListItem("items", index)}>
      <IconTrash />
    </ActionIcon>
  </Group>
))}
```

## Full Example

```typescript
"use client"

import { useEffect, useState } from "react"
import {
  Button,
  Divider,
  Select,
  Stack,
  TextInput,
  notifications,
} from "@repo/mantine-ui"
import { IconSend } from "@repo/mantine-ui/icons"
import { useTicketForm, TicketFormProvider } from "./ticket-form.context"
import { ticketFormInitialValues, ticketFormSchema } from "./ticket-form.type"

export function TicketForm({ reference }: { reference: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useTicketForm({
    validate: mtnZodResolver(ticketFormSchema),
    enhanceGetInputProps: () => ({ disabled: isLoading }),
  })

  // Initialize with async data
  useEffect(() => {
    form.initialize({
      ...ticketFormInitialValues,
      reference,
    })
  }, [reference])

  const handleSubmit = async (data: TicketFormType) => {
    setIsLoading(true)
    try {
      await api.tickets.create.mutateAsync(data)
      notifications.show({
        title: "Success",
        message: "Ticket created successfully",
        color: "green",
      })
      form.reset()
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create ticket",
        color: "red",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitErrors = (errors: typeof form.errors) => {
    notifications.show({
      title: "Validation Error",
      message: Object.values(errors).join(", "),
      color: "red",
    })
  }

  return (
    <TicketFormProvider form={form}>
      <form onSubmit={form.onSubmit(handleSubmit, handleSubmitErrors)}>
        <Stack>
          <TextInput
            withAsterisk
            label="Subject"
            {...form.getInputProps("subject")}
            key={form.key("subject")}
          />

          <Select
            label="Priority"
            data={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
            {...form.getInputProps("priority")}
            key={form.key("priority")}
          />

          <Divider />

          <Button
            type="submit"
            loading={isLoading}
            rightSection={<IconSend />}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </TicketFormProvider>
  )
}
```
