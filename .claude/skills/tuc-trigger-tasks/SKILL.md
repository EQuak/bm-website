---
name: trigger-tasks
description: Trigger.dev v4 task patterns for this monorepo. Use when creating background tasks with Trigger.dev. Covers task and schemaTask definitions, scheduled tasks, triggering from backend, triggerAndWait result handling, and wait utilities. MUST use @trigger.dev/sdk v4, NEVER client.defineJob.
---

# Trigger.dev v4 task patterns

## Overview

Trigger.dev v4 uses the `@trigger.dev/sdk` package. Tasks run in the background with no timeouts and automatic retries.

## Critical Rules

### ALWAYS DO:
- Import from `@trigger.dev/sdk` (v4)
- Use `task()` or `schemaTask()` for task definitions
- Check `result.ok` before accessing `result.output` from `triggerAndWait`
- Use proper TypeScript types for payloads

### NEVER DO:
- Use `client.defineJob()` (v2 deprecated - BREAKS APPLICATION)
- Wrap `triggerAndWait` in `Promise.all` (not supported)
- Wrap `wait.*` calls in `Promise.all` (not supported)
- Guess at result structure (always check `.ok` first)

## Basic Task

```typescript
import { task } from "@trigger.dev/sdk"

export const processData = task({
  id: "process-data",
  retry: {
    maxAttempts: 10,
    factor: 1.8,
    minTimeoutInMs: 500,
    maxTimeoutInMs: 30_000,
    randomize: false,
  },
  run: async (payload: { userId: string; data: any[] }) => {
    console.log(`Processing ${payload.data.length} items for user ${payload.userId}`)

    // Task logic - runs for long time, no timeouts
    for (const item of payload.data) {
      await processItem(item)
    }

    return { processed: payload.data.length }
  },
})
```

## Schema Task (with Zod validation)

```typescript
import { schemaTask } from "@trigger.dev/sdk"
import { z } from "zod"

export const validatedTask = schemaTask({
  id: "validated-task",
  schema: z.object({
    name: z.string(),
    age: z.number(),
    email: z.string().email(),
  }),
  run: async (payload) => {
    // Payload is automatically validated and typed
    console.log(`Hello ${payload.name}, age ${payload.age}`)
    return { message: `Processed ${payload.email}` }
  },
})
```

## Scheduled Task

```typescript
import { schedules } from "@trigger.dev/sdk"

export const dailyReport = schedules.task({
  id: "daily-report",
  cron: "0 9 * * *", // Daily at 9:00 AM UTC
  // With timezone:
  // cron: { pattern: "0 9 * * *", timezone: "America/New_York" },
  run: async (payload) => {
    console.log("Scheduled run at:", payload.timestamp)
    console.log("Last run was:", payload.lastTimestamp)
    console.log("Next 5 runs:", payload.upcoming)

    // Generate daily report logic
    await generateReport()

    return { reportGenerated: true, date: payload.timestamp }
  },
})
```

## Triggering Tasks

### From Backend Code

```typescript
import { tasks } from "@trigger.dev/sdk"
import type { processData } from "./trigger/tasks"

// Single trigger
const handle = await tasks.trigger<typeof processData>("process-data", {
  userId: "123",
  data: [{ id: 1 }, { id: 2 }],
})

// Batch trigger
const batchHandle = await tasks.batchTrigger<typeof processData>("process-data", [
  { payload: { userId: "123", data: [{ id: 1 }] } },
  { payload: { userId: "456", data: [{ id: 2 }] } },
])
```

### From Inside Tasks (with Result handling)

```typescript
export const parentTask = task({
  id: "parent-task",
  run: async (payload) => {
    // Trigger and continue (fire-and-forget)
    const handle = await childTask.trigger({ data: "value" })

    // Trigger and wait - returns Result object, NOT direct output
    const result = await childTask.triggerAndWait({ data: "value" })

    // MUST check result.ok before accessing output
    if (result.ok) {
      console.log("Task output:", result.output)
    } else {
      console.error("Task failed:", result.error)
    }

    // Quick unwrap (throws on error)
    const output = await childTask.triggerAndWait({ data: "value" }).unwrap()

    // Batch trigger and wait
    const results = await childTask.batchTriggerAndWait([
      { payload: { data: "item1" } },
      { payload: { data: "item2" } },
    ])

    for (const run of results) {
      if (run.ok) {
        console.log("Success:", run.output)
      } else {
        console.log("Failed:", run.error)
      }
    }

    return { processed: true }
  },
})

export const childTask = task({
  id: "child-task",
  run: async (payload: { data: string }) => {
    return { processed: payload.data }
  },
})
```

## Wait Utilities

```typescript
import { task, wait } from "@trigger.dev/sdk"

export const taskWithWaits = task({
  id: "task-with-waits",
  run: async (payload) => {
    console.log("Starting task")

    // Wait for specific duration
    await wait.for({ seconds: 30 })
    await wait.for({ minutes: 5 })
    await wait.for({ hours: 1 })
    await wait.for({ days: 1 })

    // Wait until specific date
    await wait.until({ date: new Date("2024-12-25") })

    // Wait for token (from external system)
    await wait.forToken({
      token: "user-approval-token",
      timeoutInSeconds: 3600, // 1 hour timeout
    })

    console.log("All waits completed")
    return { status: "completed" }
  },
})
```

## Result vs Output

**CRITICAL**: `triggerAndWait()` returns a `Result` object, NOT the task output directly.

```typescript
// WRONG - Will cause errors
const output = await childTask.triggerAndWait({ data: "value" })
console.log(output.processed) // ❌ undefined or error

// CORRECT - Check result.ok first
const result = await childTask.triggerAndWait({ data: "value" })
if (result.ok) {
  console.log(result.output.processed) // ✅ Correct access
}

// CORRECT - Use unwrap() if you want to throw on error
const output = await childTask.triggerAndWait({ data: "value" }).unwrap()
console.log(output.processed) // ✅ Direct access, throws if failed
```

## Key Points

- **Waits > 5 seconds**: Automatically checkpointed, don't count toward compute usage
- **Type safety**: Use `import type` for task references when triggering from backend
- **No Promise.all**: Never wrap `triggerAndWait` or `wait.*` in Promise.all/allSettled

## Full Example

```typescript
import { task, schemaTask, wait } from "@trigger.dev/sdk"
import { z } from "zod"

// Main orchestrator task
export const processOrder = schemaTask({
  id: "process-order",
  schema: z.object({
    orderId: z.string().uuid(),
    items: z.array(z.object({
      sku: z.string(),
      quantity: z.number(),
    })),
  }),
  retry: {
    maxAttempts: 5,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 60_000,
  },
  run: async (payload) => {
    console.log(`Processing order ${payload.orderId}`)

    // Process each item
    const results = []
    for (const item of payload.items) {
      const result = await processItem.triggerAndWait({
        orderId: payload.orderId,
        sku: item.sku,
        quantity: item.quantity,
      })

      if (result.ok) {
        results.push(result.output)
      } else {
        console.error(`Failed to process ${item.sku}:`, result.error)
        throw new Error(`Item processing failed: ${item.sku}`)
      }
    }

    // Wait for payment confirmation
    await wait.forToken({
      token: `payment-${payload.orderId}`,
      timeoutInSeconds: 3600,
    })

    // Send confirmation
    await sendConfirmation.trigger({
      orderId: payload.orderId,
      itemsProcessed: results.length,
    })

    return {
      orderId: payload.orderId,
      itemsProcessed: results.length,
      status: "completed",
    }
  },
})

export const processItem = task({
  id: "process-item",
  run: async (payload: { orderId: string; sku: string; quantity: number }) => {
    console.log(`Processing ${payload.quantity}x ${payload.sku}`)

    // Simulate processing
    await wait.for({ seconds: 2 })

    return {
      sku: payload.sku,
      processed: true,
    }
  },
})

export const sendConfirmation = task({
  id: "send-confirmation",
  run: async (payload: { orderId: string; itemsProcessed: number }) => {
    console.log(`Sending confirmation for order ${payload.orderId}`)
    // Send email/notification
    return { sent: true }
  },
})
```

## DEPRECATED (v2) - NEVER USE

```typescript
// ❌ BREAKS APPLICATION - v2 deprecated pattern
client.defineJob({
  id: "job-id",
  run: async (payload, io) => {
    /* ... */
  },
})
```

Always use v4 SDK (`@trigger.dev/sdk`) with `task()` or `schemaTask()`.
