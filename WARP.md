# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands you’ll use most

- Install deps (workspace):
  - pnpm install

- Dev (monorepo):
  - pnpm dev

- Build (monorepo):
  - pnpm build

- Dev/Build/Start (apps/web):
  - pnpm --filter web dev        # Next.js dev with Turbopack, loads env from ../../.env
  - pnpm --filter web build
  - pnpm start:web               # Runs web in production mode with env

- Typecheck:
  - pnpm typecheck               # Turbo typecheck across packages
  - pnpm --filter web typecheck  # tsc --noEmit for the web app

- Lint/format (Biome):
  - pnpm format-and-lint:check       # staged
  - pnpm format-and-lint:check:all   # entire repo
  - pnpm format-and-lint             # write fixes to staged
  - pnpm format-and-lint:all         # write fixes repo-wide

- Clean:
  - pnpm clean:workspaces        # turbo clean
  - pnpm --filter web clean      # cleans .next/.turbo/node_modules for web

- Database (Drizzle + Supabase):
  - pnpm -F db generate          # generate migrations
  - pnpm -F db generate-custom   # custom generators
  - pnpm -F db migrate           # apply migrations
  - pnpm -F db push              # push schema
  - pnpm -F db studio            # open studio
  - pnpm -F db drop              # drop database
  - pnpm db:seed                 # seeds via Bun (requires bun)

- Testing
  - This repo’s guidelines reference Vitest (unit/integration) and Playwright (E2E). If/when configured, typical commands are:
    - Vitest: pnpm vitest
      - Single test: pnpm vitest path/to/file.test.ts -t "name"
    - Playwright: pnpm exec playwright test
      - Single test: pnpm exec playwright test path/to/spec.ts -g "name"
  - Jest is present as a dev dependency at the root. If Jest tests exist but no script is defined, run:
    - pnpm jest
      - Single test: pnpm jest path/to/file.test.ts -t "name"

Notes
- The web app scripts automatically load environment from the monorepo root .env using dotenv (see apps/web/package.json "with-env").
- Turbo uses globalEnv to pass through envs like POSTGRES_URL, SUPABASE_* (see turbo.json). Ensure these are present in .env before builds/dev.


## High-level architecture

Monorepo managed by pnpm + Turborepo
- apps/web: Next.js 15 (App Router) frontend
  - UI: Mantine UI + Tailwind (custom preset from packages/mantine-ui; tailwind-scrollbar plugin)
  - State: React Query (server state), local React state; optional Zustand for client state per guidelines
  - Routing: App Router with modular folders, server components, redirects in next.config.ts
  - Images: remotePatterns configured (randomuser.me, supabase, localhost)
  - PostHog: via @posthog/nextjs
  - Build: transpilePackages includes internal workspaces (@repo/tailwind, @repo/mantine-ui, @repo/db, @repo/api)
  - TS paths: #/* alias to ./src/*, assets/* to ./src/assets/*
  - Env: scripts run with dotenv -e ../../.env

- packages/api: tRPC server layer
  - Pattern (from .cursorrules): domain funcs in src/funcs/*.funcs.ts, routers in src/router/**/*.router.ts
  - Validation with Zod; end-to-end types via tRPC
  - Drizzle ORM available on ctx.db; input/output types explicit
  - Client usage in web:
    - Client components: import api from #trpc/react (useQuery/useSuspenseQuery/useMutation)
    - Server components: import api from #trpc/server; can prefetch and hydrate via <HydrateClient>

- packages/db: Drizzle ORM + schema + seeds
  - Schema in src/schema/** (inventory, projects, notifications, staffing, tks, etc.)
  - ACL and utilities under src/acl and src/lib
  - Seeding via packages/db/src/seed (seed.ts invoked by pnpm db:seed, requires bun)
  - Supabase migrations tracked in supabase/migrations/

- packages/mantine-ui: Shared UI kit
  - Components, icons, theme, tiptap integrations, Tailwind preset exported and consumed by apps/web/tailwind.config.ts

- packages/tailwind: Tailwind workspace package (consumed by UI preset)

- tooling: central configs for eslint/prettier/typescript

Cross-cutting concerns and conventions (from .cursorrules)
- Clean Architecture for components: each component with a single primary responsibility; split into smaller components when complex; use index.ts for clean exports
- State management guidance:
  - Prefer React hooks; use @repo/mantine-ui useForm for forms
  - NUQS for URL state where applicable; React Query for server state; Zustand for global client state when needed
- API rules:
  - File and function naming conventions (entityName.funcs.ts, getEntity/addEntity, first param DB client)
  - Query patterns: db.query.Table.findMany for simple, db.select().from for complex
  - Pagination rules; consistent error handling and typed errors
  - Documentation: JSDoc for complex functions; group related funcs by domain; keep utils/types exported cleanly

Staffing module (overview)
- See CLAUDE.md for a detailed map. Key takeaways:
  - Drag-and-drop staffing board UI with employee pool and project columns
  - 10-status system for assignments with color coding
  - tRPC-backed CRUD for assignments and notes; real-time presence via Supabase (and mock users for collaboration)
  - Assignment flow: DnD -> validation -> modal -> create/update -> invalidate/cache-refresh


## Environment and runtime specifics

- Node >= 20; packageManager is pnpm@9.5.0 (see root package.json)
- Global env passthrough (turbo.json):
  - POSTGRES_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, RESEND_API_KEY
- apps/web expects .env at monorepo root (../../.env from apps/web)


## Editor/assistant rules to be aware of

Cursor (.cursorrules)
- Linear integration: When the term "issue" appears, it refers to Linear issues. Available tools: create_issue, list_issues, update_issue, list_teams, list_projects, search_issues, get_issue
- Linear Team ID: 1d20b06e-564d-423a-8aa6-de78812fa7cb
- Linear Project ID: a58bee43-e7fb-4bfd-a852-2daf5bf0ca62
- Tech Stack expectations: Next.js App Router, Mantine + Tailwind, Supabase (Auth/Realtime/Storage), PostHog, TRPC, Drizzle, Biome, pnpm, Turborepo
- Thinking process: before implementing, consult packages/api (funcs/router), packages/db/schema, and apps/web, plus ai/docs for API/DB/UI

Claude (CLAUDE.md)
- Contains an in-depth analysis of the Staffing module: data model (assignments, notes), UI composition, tRPC API surface, real-time features, and enhancement roadmap. Review it when working on staffing features.


## When running a single test

- Vitest (if configured): pnpm vitest path/to/file.test.ts -t "case name"
- Playwright (if configured): pnpm exec playwright test path/to/spec.ts -g "case name"
- Jest (present as devDependency): pnpm jest path/to/file.test.ts -t "case name"


## Tips that are specific to this repo

- Use the provided workspace scripts instead of calling tools directly: they set up env, respect Turbo tasks, and handle workspace filtering.
- For apps/web, prefer importing api from #trpc/react in client components and #trpc/server in server components; wrap pages that require hydration with <HydrateClient> to leverage prefetch.
- Tailwind content scanning is limited to ./src in web; shared classes from @repo/mantine-ui are included via the preset—ensure new shared components live in that workspace when you want classes to be available.

