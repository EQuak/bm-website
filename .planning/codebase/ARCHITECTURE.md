# Architecture

**Analysis Date:** 2026-01-26

## Pattern Overview

**Overall:** Next.js 15 monorepo with server-driven architecture using tRPC for API communication and React Server Components for data fetching.

**Key Characteristics:**
- Server-first rendering with React Server Components (RSCs) for data fetching
- tRPC for type-safe end-to-end communication between frontend and backend
- PostgreSQL database with Drizzle ORM for type-safe queries
- Turborepo monorepo structure for shared packages
- Supabase authentication with token-based authorization
- Multi-tenant application with workspace routing

## Layers

**Presentation Layer (UI/Pages):**
- Purpose: Server and client components that render UI and handle user interactions
- Location: `apps/web/src/app/`
- Contains: Next.js App Router pages, route groups, error boundaries, layout hierarchies
- Depends on: tRPC client, hooks, utilities, Mantine UI components
- Used by: Browser, client-side navigation

**API Layer (tRPC Backend):**
- Purpose: Type-safe RPC procedures for querying and mutating data
- Location: `packages/api/src/router/`, `packages/api/src/funcs/`
- Contains: tRPC routers (*.router.ts), business logic functions (*.funcs.ts), middleware
- Depends on: Database layer, Supabase services, utilities
- Used by: Client components via tRPC hooks, server components via server caller

**Data Layer (Database):**
- Purpose: Persistent data storage and schema management
- Location: `packages/db/src/schema/`, `packages/db/src/lib/`
- Contains: Drizzle table definitions (*.table.ts), relations, Zod schemas
- Depends on: PostgreSQL
- Used by: API routers and functions

**Shared Services Layer:**
- Purpose: Cross-cutting concerns and reusable utilities
- Location: `packages/shared/`, `packages/mantine-ui/`, `packages/tailwind/`
- Contains: UI components, theme configuration, utilities, hooks
- Depends on: React, Mantine, Tailwind CSS
- Used by: Frontend and other packages

## Data Flow

**Query Flow (Reading Data):**

1. User component (client or server) calls tRPC endpoint
2. Client: Uses `api.*.useSuspenseQuery()` hook
3. Server: Uses `api.*.prefetch()` or server caller
4. tRPC router procedure receives request with auth context
5. Router calls business logic function in `funcs/` directory
6. Function queries database using Drizzle ORM
7. Database returns typed data
8. Response sent back with SuperJSON serialization
9. Client receives and caches data via React Query

**Mutation Flow (Writing Data):**

1. Client component calls tRPC mutation
2. Uses `api.*.useMutation()` hook with onSuccess/onError handlers
3. tRPC router procedure validates input with Zod
4. Router calls business logic function
5. Function performs database write operation
6. Returns modified/created data
7. Client updates cache and UI via mutation callbacks
8. PostHog captures analytics for critical operations

**Authentication Flow:**

1. Supabase Auth handles session management (phone OTP, email OTP, password)
2. Token stored in HTTP-only cookie (cloaked via ssr-only-secrets)
3. tRPC context extracts token from Authorization header or cookies
4. Token claims verified with `supabase.auth.getClaims()`
5. User ID attached to context for protected procedures
6. RBAC context provides role-based access checks via casl

**State Management:**

- Server state: React Query (tRPC) - primary for server data
- URL state: NUQS (useQueryState) - for shareable filters, pagination, search
- Local UI state: useState - for temporary component-level state (modals, toggles)
- Global state: Zustand stores (counter-store.ts, theme-store.ts) - minimal use
- Theme state: Mantine + custom theme provider

## Key Abstractions

**Server Page Component:**
- Purpose: Entry point that fetches data and coordinates client components
- Examples: `apps/web/src/app/(application)/app/(employees)/employees/[...mode]/page.tsx`
- Pattern: Async function that awaits params (Next.js 15), prefetches data, wraps clients in HydrateClient
- File structure: page.tsx (server), _components/ (client components)

**Mode-based Routing:**
- Purpose: Handle list/create/edit/view actions in single route
- Examples: `/employees/list`, `/employees/create`, `/employees/edit/:id`, `/employees/view/:id`
- Pattern: `[...mode]` catch-all segment in App Router
- Implementation: Page receives mode array and renders corresponding component

**tRPC Router:**
- Purpose: Define type-safe procedures for queries and mutations
- Examples: `packages/api/src/router/profiles.router.ts`, `packages/api/src/router/work_orders/work_orders.router.ts`
- Pattern: Export named router using createTRPCRouter, group related procedures
- Input validation: Zod schemas from database layer

**Business Logic Function:**
- Purpose: Encapsulate complex queries and data transformations
- Examples: `packages/api/src/funcs/profiles.funcs.ts`
- Pattern: Exported functions that accept DBClient and input, return typed data
- Usage: Called from router procedures, can be reused across procedures

**Database Table Definition:**
- Purpose: Define schema with migrations and relationships
- Examples: `packages/db/src/schema/employee_information.table.ts`
- Pattern: pgTable() with Drizzle, relations with underscore prefix, Zod schemas exported
- Includes: Type inference (Select/Insert), indexes, foreign keys, default values

**Client Component Hook:**
- Purpose: Consume tRPC data with React hooks
- Examples: `apps/web/src/hooks/useWorkspaceRouter.tsx`
- Pattern: "use client" directive, destructure useSuspenseQuery as [data, queryInfo] tuple
- Error handling: Wrapped in Suspense and error boundaries

**Route Group:**
- Purpose: Organize related routes without URL changes
- Examples: `(application)`, `(auth)`, `(beta)`, `(forms)`, `(errors)`
- Pattern: Directory name in parentheses, used for layout sharing and permission checks
- Usage: Apply layouts, middleware, error boundaries to group

## Entry Points

**Web Application Root:**
- Location: `apps/web/src/app/layout.tsx`
- Triggers: Server startup, browser visit to /
- Responsibilities: Configure root metadata, setup providers (tRPC, theme, analytics), handle cookie cloaking for SSR secrets

**Authenticated Application:**
- Location: `apps/web/src/app/(application)/`
- Triggers: Authenticated user navigation
- Responsibilities: Apply app layout, setup workspace routing, check RBAC permissions

**Public Pages:**
- Location: `apps/web/src/app/(auth)/`, `apps/web/src/app/(forms)/`
- Triggers: Unauthenticated user or public form access
- Responsibilities: Handle login, signup, employment form submissions

**API Handler:**
- Location: `apps/web/src/app/api/trpc/[trpc]/route.ts`
- Triggers: All tRPC client requests to /api/trpc
- Responsibilities: Create tRPC context with auth, route to appRouter, handle errors with PostHog

**tRPC Root Router:**
- Location: `packages/api/src/root.ts`
- Triggers: API requests through fetchRequestHandler
- Responsibilities: Merge all feature routers into single API surface

## Error Handling

**Strategy:** Layered error handling with user-facing messages and developer/monitoring visibility

**Patterns:**

- **Client Components:** Catch via error boundaries (app/error.tsx), display user-friendly message with error details
- **Forms:** Validation with Mantine useForm + Zod, field-level error display
- **tRPC Procedures:** Throw TRPCError with code and message, handled automatically
- **Database Queries:** Try/catch in router procedures, logged to console in dev, captured in PostHog
- **Async Tasks:** Trigger.dev job error handling with retry logic and dead-letter queues

**Error Logging:**
- Development: Console.error with context
- Production: PostHog capture via captureServerException
- API: Request path, error code, user ID included

**User Feedback:**
- Toasts via @mantine/notifications for form submissions
- Error boundary component with details for critical failures
- Field-level validation messages in forms

## Cross-Cutting Concerns

**Logging:**
- tRPC procedures log execution time and path
- Development: React Query DevTools logs all queries/mutations
- PostHog: Analytics and error tracking
- No centralized log aggregation configured

**Validation:**
- Zod schemas at database layer, exported to routers
- mtnZodResolver integrates Zod with Mantine forms
- Input validation at tRPC procedure level before business logic

**Authentication:**
- Supabase Auth token validation in tRPC context
- Protected procedures check `ctx.user?.id` and throw UNAUTHORIZED
- Admin procedures available but not enforced (commented out)
- RBAC via casl AbilityProvider for feature-level permissions

**Authorization:**
- Role-based access checks via RBAC context
- ContextualCan component for conditional rendering
- useRBAC hook for imperative permission checks
- RLS (Row Level Security) policies defined in Supabase

**Caching:**
- React Query via tRPC handles client-side caching
- Stale-while-revalidate pattern for queries
- Manual mutation invalidation for optimistic updates
- Server-side caching through React Query singleton pattern

---

*Architecture analysis: 2026-01-26*
