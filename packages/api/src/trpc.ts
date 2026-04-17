/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */

import { db } from "@repo/db/client"
import type { SupabaseClient } from "@supabase/supabase-js"
import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"

import {
  isEffectivePlatformStaff,
  isPlatformStaffUser
} from "./utils/platform-staff"

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: {
  headers: Headers
  supabase: SupabaseClient
  supabaseAdmin: SupabaseClient
}) => {
  const token = opts.headers.get("authorization")?.replace("Bearer ", "")

  const response = await opts.supabase.auth.getClaims(token)
  const userId = response.data?.claims?.sub ?? null

  let user: {
    id: string
    appMetadata: Record<string, unknown>
    isPlatformStaff: boolean
  } | null = null

  if (userId) {
    let appMetadata: Record<string, unknown> = {}
    try {
      const { data, error } =
        await opts.supabaseAdmin.auth.admin.getUserById(userId)
      if (!error && data.user?.app_metadata) {
        appMetadata = data.user.app_metadata as Record<string, unknown>
      }
    } catch {
      // Admin lookup failed; still allow env-based platform allowlist
    }
    user = {
      id: userId,
      appMetadata,
      isPlatformStaff: isPlatformStaffUser(userId, appMetadata)
    }
  }

  return {
    db,
    user,
    ...opts
  }
}

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
    }
  })
})

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and sub routers in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router
export const createRouterMerger = t.mergeRouters

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now()

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }

  const result = await next()

  const end = Date.now()
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`)

  return result
})

/**
 * Public (unauthorized) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure
  .use(timingMiddleware)
  .use(async ({ ctx, next }) => {
    const { supabase, supabaseAdmin: _sbAdmin, ...rest } = ctx
    return next({
      ctx: {
        supabase,
        ...rest
      }
    })
  })

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" })
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    })
  })

/**
 * Internal tools: cross-org reads, impersonation picker, etc.
 * Requires `app_metadata.platform_staff === true` (or PLATFORM_STAFF_USER_IDS).
 */
export const platformProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!isEffectivePlatformStaff(ctx)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Platform staff access required."
    })
  }
  return next({ ctx })
})

export const adminProtectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    // if (ctx.user.app_metadata.rbac?.role !== "admin") {
    //   throw new TRPCError({ code: "FORBIDDEN" })
    // }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    })
  })
