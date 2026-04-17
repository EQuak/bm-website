# Codebase Structure

**Analysis Date:** 2026-01-26

## Directory Layout

```
monorepo/
├── apps/
│   ├── web/                           # Main Next.js web application
│   │   ├── src/
│   │   │   ├── app/                   # Next.js App Router
│   │   │   │   ├── (application)/     # Route group: authenticated app
│   │   │   │   │   └── app/           # Main app routes
│   │   │   │   │       ├── (beta)/
│   │   │   │   │       ├── (company-directory)/
│   │   │   │   │       ├── (company-videos)/
│   │   │   │   │       ├── (employee-kudos)/
│   │   │   │   │       ├── (employees)/
│   │   │   │   │       ├── (hr)/
│   │   │   │   │       ├── (inventory)/
│   │   │   │   │       ├── (job-applications)/
│   │   │   │   │       ├── (projects)/
│   │   │   │   │       ├── (reference-material)/
│   │   │   │   │       ├── (reports)/
│   │   │   │   │       ├── (safety-and-training)/
│   │   │   │   │       ├── (settings)/
│   │   │   │   │       ├── (staffing)/
│   │   │   │   │       ├── (suggestions)/
│   │   │   │   │       ├── (tickets)/
│   │   │   │   │       ├── _components/ # Shared app components
│   │   │   │   │       ├── layout.tsx
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── (auth)/             # Route group: authentication flows
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── signup/
│   │   │   │   │   └── ...
│   │   │   │   ├── (errors)/           # Route group: error pages
│   │   │   │   ├── (forms)/            # Route group: public forms
│   │   │   │   ├── api/                # API routes (tRPC, webhooks)
│   │   │   │   │   ├── trpc/[trpc]/
│   │   │   │   │   ├── webhooks/
│   │   │   │   │   └── cron/
│   │   │   │   ├── layout.tsx          # Root layout
│   │   │   │   ├── error.tsx           # Global error boundary
│   │   │   │   ├── global-error.tsx    # Catch-all error boundary
│   │   │   │   ├── not-found.tsx       # 404 page
│   │   │   │   └── page.tsx            # Home page
│   │   │   ├── core/                   # Core configuration and components
│   │   │   │   ├── components/         # Shared UI components
│   │   │   │   │   ├── sidebar-notification-badges/
│   │   │   │   │   ├── custom-table/
│   │   │   │   │   ├── top-page-wrapper/
│   │   │   │   │   ├── ErrorDetails.tsx
│   │   │   │   │   ├── LoaderPage.tsx
│   │   │   │   │   └── ...
│   │   │   │   ├── config/             # Configuration files
│   │   │   │   │   ├── routes.ts       # Route helpers
│   │   │   │   │   ├── site.ts         # Site configuration
│   │   │   │   │   └── storage.ts      # Storage configuration
│   │   │   │   └── context/            # React context providers
│   │   │   │       ├── rbac/           # Role-based access control
│   │   │   │       └── AppContext.tsx
│   │   │   ├── hooks/                  # Custom React hooks
│   │   │   │   ├── useWorkspaceRouter.tsx
│   │   │   │   ├── useAutoRefreshEmailStatus.tsx
│   │   │   │   ├── useSidebarToggle.tsx
│   │   │   │   └── ...
│   │   │   ├── providers/              # React context providers
│   │   │   │   ├── posthog-provider.tsx
│   │   │   │   ├── theme-provider.tsx
│   │   │   │   └── theme-store-provider.tsx
│   │   │   ├── stores/                 # Zustand state stores
│   │   │   │   ├── counter-store.ts
│   │   │   │   └── theme-store.ts
│   │   │   ├── trpc/                   # tRPC client setup
│   │   │   │   ├── react.tsx           # tRPC React provider
│   │   │   │   ├── server.ts           # tRPC server caller
│   │   │   │   └── query-client.ts
│   │   │   ├── utils/                  # Utility functions
│   │   │   │   ├── error/              # Error handling
│   │   │   │   ├── supabase/           # Supabase utilities
│   │   │   │   ├── format.ts
│   │   │   │   ├── capitalize_words.ts
│   │   │   │   └── ...
│   │   │   ├── types/                  # TypeScript type definitions
│   │   │   ├── theme/                  # Mantine theme configuration
│   │   │   ├── styles/                 # Global CSS
│   │   │   ├── assets/                 # Icons, images
│   │   │   ├── env.ts                  # Environment variables
│   │   │   └── instrumentation-client.ts
│   │   ├── public/                     # Static assets
│   │   ├── next.config.ts              # Next.js configuration
│   │   └── package.json
│   │
│   └── mobile/                         # React Native mobile app (Expo)
│       └── ...
│
├── packages/
│   ├── api/                            # tRPC backend API
│   │   ├── src/
│   │   │   ├── router/                 # tRPC routers
│   │   │   │   ├── profiles.router.ts
│   │   │   │   ├── employee_information.router.ts
│   │   │   │   ├── inventory/          # Inventory feature routers
│   │   │   │   ├── projects/           # Project management routers
│   │   │   │   ├── work_orders/        # Work order routers
│   │   │   │   ├── staffing/           # Staffing routers
│   │   │   │   ├── notifications/      # Notification routers
│   │   │   │   └── async/              # Async job routers
│   │   │   ├── funcs/                  # Business logic functions
│   │   │   │   ├── profiles.funcs.ts
│   │   │   │   ├── emails/
│   │   │   │   └── ...
│   │   │   ├── utils/                  # API utilities
│   │   │   │   ├── supabase/
│   │   │   │   └── ...
│   │   │   ├── root.ts                 # Root router that merges all routers
│   │   │   ├── trpc.ts                 # tRPC configuration
│   │   │   └── index.ts                # Main export
│   │   └── package.json
│   │
│   ├── db/                             # Drizzle ORM database
│   │   ├── src/
│   │   │   ├── schema/                 # Database table definitions
│   │   │   │   ├── employee_information.table.ts
│   │   │   │   ├── profiles.table.ts
│   │   │   │   ├── inventory/          # Inventory tables
│   │   │   │   │   ├── items.table.ts
│   │   │   │   │   ├── buildings.table.ts
│   │   │   │   │   ├── locations.table.ts
│   │   │   │   │   └── ...
│   │   │   │   ├── work_orders/        # Work order tables
│   │   │   │   ├── staffing/           # Staffing tables
│   │   │   │   ├── notifications/      # Notification tables
│   │   │   │   ├── acls_roles.table.ts
│   │   │   │   ├── certifications.table.ts
│   │   │   │   ├── job_applications.table.ts
│   │   │   │   ├── job_positions.table.ts
│   │   │   │   ├── projects/           # Project tables
│   │   │   │   ├── tks/                # Ticket system tables
│   │   │   │   ├── _storage/           # Storage bucket metadata
│   │   │   │   ├── acl/                # Access control lists
│   │   │   │   └── index.ts            # Export all schemas
│   │   │   ├── lib/                    # Database utilities
│   │   │   │   └── utils.ts            # Timestamp helpers
│   │   │   ├── client.ts               # Drizzle client
│   │   │   └── seed/                   # Seed data scripts
│   │   ├── migrations/                 # Drizzle migrations
│   │   └── package.json
│   │
│   ├── mantine-ui/                     # Shared Mantine UI components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── ...
│   │   └── package.json
│   │
│   ├── react-email/                    # Email templates
│   │   ├── src/
│   │   │   ├── emails/
│   │   │   │   ├── auth/
│   │   │   │   ├── tickets/
│   │   │   │   ├── work-orders/
│   │   │   │   └── job-applications/
│   │   │   └── ...
│   │   └── package.json
│   │
│   ├── tasks/                          # Trigger.dev background tasks
│   │   ├── src/
│   │   │   └── triggers/
│   │   └── package.json
│   │
│   ├── shared/                         # Shared utilities
│   │   └── package.json
│   │
│   └── tailwind/                       # Shared Tailwind configuration
│       └── package.json
│
├── supabase/                           # Supabase configuration
│   ├── migrations/                     # Database migrations
│   ├── functions/                      # Supabase Edge Functions
│   │   ├── async-worker/
│   │   ├── async-fanout/
│   │   └── _shared/
│   └── config.toml
│
├── tooling/                            # Build tooling and config
│   ├── eslint-config/
│   ├── prettier-config/
│   └── typescript-config/
│
├── ai/                                 # AI documentation
│   ├── docs/                           # Detailed guides
│   │   ├── api/                        # API documentation
│   │   ├── database/                   # Database schema reference
│   │   ├── architecture/               # Architecture decisions
│   │   └── ui/                         # UI component patterns
│   ├── projects/                       # Project documentation
│   ├── knowledge/                      # Project knowledge base
│   └── ...
│
└── .planning/
    └── codebase/                       # GSD codebase analysis documents
        ├── ARCHITECTURE.md
        ├── STRUCTURE.md
        ├── CONVENTIONS.md
        ├── TESTING.md
        ├── STACK.md
        ├── INTEGRATIONS.md
        └── CONCERNS.md
```

## Directory Purposes

**`apps/web/src/app/`:**
- Purpose: Next.js App Router page hierarchy with route groups
- Contains: Pages (page.tsx), layouts (layout.tsx), error boundaries, route groups
- Key files: `(application)/app/` contains main authenticated application routes

**`apps/web/src/core/`:**
- Purpose: Core application configuration, shared components, and context
- Contains: Configuration files (routes.ts, site.ts), UI components, React contexts (RBAC, auth)
- Key files: `context/rbac/` for permission checking, `config/routes.ts` for route helpers

**`apps/web/src/hooks/`:**
- Purpose: Custom React hooks for recurring patterns
- Contains: useWorkspaceRouter (multi-tenant routing), useAutoRefresh, useSidebarToggle
- Key files: `useWorkspaceRouter.tsx` for workspace-aware navigation

**`apps/web/src/trpc/`:**
- Purpose: tRPC client setup and configuration
- Contains: React provider component, query client factory, server-side caller
- Key files: `react.tsx` for TRPCReactProvider, `server.ts` for RSC calls

**`apps/web/src/utils/`:**
- Purpose: Utility functions organized by domain
- Contains: Error handling, Supabase utilities, formatters, string utilities
- Key files: `error/` for error formatting, `supabase/` for auth/storage helpers

**`packages/api/src/router/`:**
- Purpose: Define tRPC procedures for all features
- Contains: Feature routers (*.router.ts) that group related queries/mutations
- Naming: One router file per feature domain (profiles.router.ts, inventory/items.router.ts)

**`packages/api/src/funcs/`:**
- Purpose: Business logic extracted from routers for reusability
- Contains: Functions accepting DBClient, performing queries/mutations
- Naming: Match router names (profiles.funcs.ts pairs with profiles.router.ts)

**`packages/db/src/schema/`:**
- Purpose: Database table definitions with Drizzle ORM
- Contains: Table definitions (*.table.ts), relations, Zod schemas
- Naming: singular table name with .table.ts suffix (employee_information.table.ts)
- Feature organization: Related tables in subdirectories (inventory/, work_orders/, staffing/)

**`apps/web/src/app/(application)/app/[feature]/[...mode]/`:**
- Purpose: CRUD pages with mode-based routing
- Contains: page.tsx (server component) and _components/ subdirectory
- Modes: "list" (table view), "create" (form), "edit/:id" (form), "view/:id" (detail), "my-profile" (logged-in user)

## Key File Locations

**Entry Points:**

- `apps/web/src/app/layout.tsx` - Root layout, providers setup
- `apps/web/src/app/(application)/app/layout.tsx` - Authenticated app layout
- `apps/web/src/app/api/trpc/[trpc]/route.ts` - API handler for all tRPC requests
- `packages/api/src/root.ts` - tRPC root router merging all feature routers

**Configuration:**

- `apps/web/next.config.ts` - Next.js configuration with PostHog integration
- `apps/web/src/env.ts` - Environment variable schema and validation
- `apps/web/src/core/config/routes.ts` - Route creation helpers
- `packages/api/src/trpc.ts` - tRPC context and procedure definitions

**Core Logic:**

- `packages/api/src/router/` - tRPC routers for all features
- `packages/api/src/funcs/` - Business logic functions called by routers
- `packages/db/src/schema/` - Drizzle table definitions
- `packages/db/src/client.ts` - Database client export

**Testing:**

- `apps/web/src/app/error.tsx` - Error boundary for catching render errors
- `apps/web/src/utils/error/` - Error handling utilities
- Vitest configuration (in root turbo.json or workspace config)

## Naming Conventions

**Files:**

- React components: `PascalCase.tsx` (e.g., `EmployeeCard.tsx`, `ViewEmployeeForm.tsx`)
- Utility functions: `camelCase.ts` (e.g., `formatDate.ts`, `calculateAge.ts`)
- Server components/pages: `page.tsx` (not renamed, part of App Router)
- Layout files: `layout.tsx` (not renamed, part of App Router)
- Router files: `*.router.ts` (e.g., `profiles.router.ts`)
- Function files: `*.funcs.ts` (e.g., `profiles.funcs.ts`)
- Table definitions: `*.table.ts` (e.g., `employee_information.table.ts`)
- Types: `*.types.ts` when extracted (e.g., `user.types.ts`)
- Hook files: `use*.tsx` or `use*.ts` (e.g., `useWorkspaceRouter.tsx`)

**Directories:**

- Feature folders: `kebab-case` (e.g., `employee-kudos/`, `job-applications/`)
- Route groups: `(kebab-case)` (e.g., `(application)`, `(auth)`, `(hr)`)
- Catch-all routes: `[...mode]` for CRUD modes
- Components subdirectory: `_components/` (underscore prefix for Next.js hiding)
- Shared components in pages: `_components/form/`, `_components/list/`, `_components/view-form/`

**TypeScript:**

- Database columns: `snake_case` (e.g., `first_name`, `employee_id`)
- Database tables: `PascalCase` with `Table` suffix (e.g., `EmployeeInformationTable`)
- Table relations: Underscore prefix (e.g., `_employeeInfo`, `_category`)
- Type names: `PascalCase` (e.g., `Employee`, `EmployeeInsert`, `EmployeeUpdate`)
- Variables: `camelCase` (e.g., `firstName`, `employeeList`)
- Functions: `camelCase` (e.g., `getAllProfiles()`, `updateEmployee()`)
- Constants: `UPPER_SNAKE_CASE` or `camelCase` depending on scope

## Where to Add New Code

**New Feature (e.g., "Certifications Management"):**

1. Database schema: `packages/db/src/schema/certifications.table.ts`
2. API router: `packages/api/src/router/certifications.router.ts`
3. Business logic: `packages/api/src/funcs/certifications.funcs.ts`
4. Pages: `apps/web/src/app/(application)/app/(certifications)/certifications/[...mode]/page.tsx`
5. Components: `apps/web/src/app/(application)/app/(certifications)/certifications/[...mode]/_components/`
6. Hooks: `apps/web/src/hooks/useCertifications.tsx` (if reusable)

**New Component/Module (e.g., "DataTable"):**

- Shared UI: `packages/mantine-ui/src/components/DataTable.tsx`
- Component-specific utils: `packages/mantine-ui/src/utils/dataTable.utils.ts`
- Re-export from index: `packages/mantine-ui/src/index.ts`

**Utilities:**

- Form-specific: `apps/web/src/utils/form/`
- Supabase helpers: `apps/web/src/utils/supabase/`
- Formatters: `apps/web/src/utils/` (e.g., `format.ts`, `format_phone.ts`)
- API-level: `packages/api/src/utils/`
- Database-level: `packages/db/src/lib/`

**Feature-specific Components:**

- In page layout: `apps/web/src/app/(application)/app/(feature)/feature/[...mode]/_components/`
- In subdirectories: `_components/form/`, `_components/list/`, `_components/view-form/`
- Shared across pages: `apps/web/src/core/components/`

## Special Directories

**`apps/web/src/app/_prompt-guide`:**
- Purpose: AI/developer guidance for the prompt system (likely for Claude)
- Generated: No
- Committed: Yes

**`apps/web/src/assets/`:**
- Purpose: Static icons and images
- Generated: No
- Committed: Yes
- Usage: Import and use in components (e.g., `import { Custom500Logo } from "#/assets/icons"`)

**`packages/db/src/acl/`:**
- Purpose: Access control list configurations for permissions
- Generated: No
- Committed: Yes

**`packages/tasks/`:**
- Purpose: Trigger.dev background job definitions
- Generated: No (code is committed)
- Committed: Yes

**`supabase/migrations/`:**
- Purpose: Database migration files generated by Drizzle
- Generated: Yes (by `pnpm db:generate`)
- Committed: Yes (migrations are tracked)

**`supabase/functions/`:**
- Purpose: Supabase Edge Functions for async operations
- Generated: No
- Committed: Yes

**`.turbo/`:**
- Purpose: Turborepo build cache
- Generated: Yes
- Committed: No (in .gitignore)

**`.next/`, `node_modules/`:**
- Purpose: Next.js build artifacts and dependencies
- Generated: Yes
- Committed: No (in .gitignore)

---

*Structure analysis: 2026-01-26*
