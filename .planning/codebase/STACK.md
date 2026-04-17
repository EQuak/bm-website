# Technology Stack

**Analysis Date:** 2026-01-26

## Languages

**Primary:**
- TypeScript 5.9.0 - All backend and frontend code
- JavaScript/JSX/TSX - React components and configuration

**Secondary:**
- SQL - Supabase database migrations in `supabase/migrations/`
- CSS - Tailwind CSS with PostCSS

## Runtime

**Environment:**
- Node.js >= 20

**Package Manager:**
- pnpm 10.10.0
- Lockfile: `pnpm-lock.yaml` (present)

## Frameworks

**Core:**
- Next.js 16.1.1 (App Router) - Web application framework
- React 19.2.1 - UI library for web
- React Native 0.81.5 with Expo 54.0.22 - Mobile app framework (in `apps/mobile/`)

**Backend/API:**
- tRPC 11.0.0-rc.466 - Type-safe API layer
- Next.js API Routes - HTTP endpoints in `apps/web/src/app/api/`

**Database:**
- Drizzle ORM 0.44.2 - Database ORM and query builder
- Drizzle Kit 0.31.4 - Migration and schema management tools

**UI/Components:**
- Mantine UI v7 - Component library (custom in `packages/mantine-ui/`)
- Tailwind CSS 3.4.3 - Utility-first CSS framework
- React PDF 9.1.1 - PDF rendering and generation
- React Hook Form 7.60.0 - Form state management
- TanStack React Form 1.21.1 - Alternative form library

**Testing:**
- Vitest - Unit testing framework (configured, run via `pnpm test`)
- Playwright - E2E testing framework (not configured in provided configs)
- Bun test runner - For quick test execution (`packages/api/src/`)

**Build/Dev:**
- Turbo 2.0.6 - Monorepo task orchestration
- TypeScript Compiler (tsc) - Type checking and compilation
- Biome 2.3.8 - Code linting and formatting (replaces ESLint/Prettier)
- Nodemon 3.1.9 - Development file watcher
- Turborepo - Monorepo caching and parallel builds

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` 2.90.1 - Supabase client for auth, realtime, storage
- `@supabase/ssr` 0.8.0 - Server-side rendering utilities for Supabase
- `drizzle-orm` 0.44.2 - ORM for PostgreSQL queries
- `@trpc/server` 11.0.0-rc.466 - Backend tRPC server
- `@trigger.dev/sdk` 4.0.4 - Background job orchestration

**Data Handling:**
- `zod` 3.25.0 - Runtime schema validation
- `drizzle-zod` 0.8.0 - Automatic Zod schemas from Drizzle tables
- `superjson` 2.2.1 - Enhanced JSON serialization for tRPC
- `dayjs` 1.11.10 - Date manipulation library

**Infrastructure:**
- `pg` 8.12.0 - PostgreSQL client
- `postgres` 3.4.4 - PostgreSQL driver (alternative)
- `@vercel/postgres` 0.9.0 - Vercel Postgres client
- `uuid` 10.0.0 - UUID generation (v7 used for IDs)

**Utilities:**
- `lodash` 4.17.21 - Utility functions
- `match-sorter` 6.3.4 - Fuzzy matching for filtering
- `nanoid` 5.0.7 - Unique ID generation
- `bcryptjs` 2.4.3 - Password hashing
- `validator` 13.12.0 - String validation

**State Management:**
- `zustand` 5.0.0 - Lightweight state management store
- `@tanstack/react-query` 5.50.0 - Server state and caching
- `nuqs` 2.2.1 - URL state management library

**UI/UX:**
- `framer-motion` 12.4.7 - Animation library
- `react-easy-crop` 5.0.8 - Image cropping component
- `react-virtuoso` 4.14.0 - Virtual list rendering
- `react-resizable-panels` 3.0.4 - Resizable panel layouts
- `@dnd-kit/core` 6.3.1, `@dnd-kit/sortable` 10.0.0 - Drag and drop
- `react-number-format` 5.4.3 - Number input formatting
- `react-imask` 7.6.1 - Input masking

**Authorization:**
- `@casl/ability` 6.7.3 - Role-based access control (RBAC)
- `@casl/react` 5.0.0 - React bindings for CASL

**Email & Communication:**
- `resend` 4.1.0 - Email service provider
- `@repo/react-email` (workspace) - Email template framework

**File Handling:**
- `export-to-csv` 1.4.0 - CSV export utilities
- `xlsx` 0.18.5 - Excel file reading/writing
- `exceljs` 4.4.0 - Advanced Excel generation
- `csv-parse` 6.1.0, `csv-stringify` 6.6.0 - CSV parsing and generation
- `sharp` 0.33.4 - Image processing
- `@react-pdf/renderer` 4.2.2 - React PDF generation
- `jspdf` 2.5.1, `jspdf-autotable` 3.8.3 - PDF document generation
- `html2pdf.js` 0.9.3 - HTML to PDF conversion

**Monitoring/Analytics:**
- `posthog-js` 1.264.2 - Frontend analytics
- `posthog-node` 5.22.0 - Backend analytics

**Development Tools:**
- `@commitlint/cli` 19.3.0 - Commit message linting
- `lint-staged` 15.2.7 - Pre-commit hook runner
- `husky` 9.0.11 - Git hooks management
- `dotenv-cli` 7.4.2 - Environment variable loading
- `supabase` CLI 2.67.1 - Local Supabase development

## Configuration

**Environment:**
- Environment variables defined in `.env` and `.env.example`
- Required vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `POSTGRES_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`
- Optional vars: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `NEXT_PUBLIC_POSTHOG_PROJECT_ID`
- Turbo configured in `turbo.json` with environment variable caching

**Build:**
- TypeScript config: `tooling/typescript-config/tsconfig.json` (shared base)
- Biome config: `biome.json` (linting, formatting)
- PostCSS config: `postcss.config.ts` (Tailwind with Mantine)
- Next.js config: `apps/web/next.config.ts` (Turbopack support)

**Database:**
- Drizzle Kit config: `packages/db/drizzle.config.ts`
- Supabase config: `supabase/config.toml` (PostgreSQL 17, local development)
- Migrations: `supabase/migrations/` (auto-generated by Drizzle)

## Platform Requirements

**Development:**
- Node.js 20+
- pnpm 10.10.0
- Docker/Supabase CLI for local PostgreSQL database
- Git with Husky hooks

**Production:**
- Node.js 20+
- PostgreSQL 17+ database (via Supabase or self-hosted)
- Supabase project for auth, storage, realtime
- Trigger.dev account for background jobs
- Resend account for email delivery
- PostHog account for monitoring (optional)

---

*Stack analysis: 2026-01-26*
