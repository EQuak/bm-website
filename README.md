# Web application monorepo (template)

A Turborepo monorepo starter: Next.js (App Router), tRPC, Drizzle ORM, Supabase (Auth, Storage, Realtime), and shared UI packages. Use it as a base for internal tools, dashboards, or line-of-business apps, then fork and add your domain.

**What “template” means:** see [`docs/TEMPLATE.md`](docs/TEMPLATE.md).

## Quick start (one path from zero)

| Step | Command / action |
| ---- | ---------------- |
| 1. Install | `pnpm install` |
| 2. Environment | Copy `.env.example` → `.env` at the repo root. Fill **Supabase** and **Postgres** URLs/keys (see comments in `.env.example`). Set `SECRET_CLIENT_COOKIE_VAR` and `NEXT_PUBLIC_APP_URL` for local dev. |
| 3. Supabase | **Local:** `supabase start` — then align `NEXT_*` and `SUPABASE_*` keys with `supabase status`. **Without Supabase:** auth, tRPC server context, and anything touching Supabase clients **will fail** at runtime; the web app expects these env vars. |
| 4. Database | Apply schema: `pnpm db:push` (or your Drizzle/Supabase migration workflow). |
| 5. (Optional) Seed | Local DB only: `pnpm db:seed` — script exits if `POSTGRES_URL` is not localhost. |
| 6. Dev | `pnpm dev` (full monorepo) or `pnpm dev:web` to run only `apps/web`. |

CI runs **`pnpm format-and-lint:check:all`** and **`pnpm typecheck:ci`** (all workspaces, including `apps/mobile`; same as local `typecheck:ci`). See [`docs/TEMPLATE.md`](docs/TEMPLATE.md).

## Project structure

- `apps/` — Applications (e.g. `web`, optional `mobile`)
- `packages/` — Shared libraries (database schema, API layer, UI kit, etc.)
- `tooling/` — Shared TypeScript, ESLint, and other tool configuration
- `supabase/` — Local Supabase configuration and migrations
- `docs/` — Template notes (`TEMPLATE.md`)

## Technology stack

**Frontend:** React, Next.js (App Router), Mantine UI, Tailwind CSS 4

**Backend & platform:** Next.js API routes, tRPC, Supabase (Auth, Realtime, Storage)

**Database:** PostgreSQL (via Supabase and Drizzle ORM)

**Typical deployment:** Vercel (app) and Supabase (database and backend services)

## Development

### Prerequisites

- Node.js 20 or later
- [pnpm](https://pnpm.io/) (see `packageManager` in root `package.json`)

### Root scripts

| Command | Description |
| -------- | ----------- |
| `pnpm dev` | Start dev tasks for apps/packages (Turborepo) |
| `pnpm build` | Build all packages and apps |
| `pnpm typecheck` | Typecheck across the monorepo |
| `pnpm typecheck:ci` | Same as CI: all packages and apps (includes `mobile`) |
| `pnpm dev:web` | Dev only the Next.js app (`apps/web`) |
| `pnpm build:web` | Build `apps/web` and its dependencies |
| `pnpm format-and-lint` | Format and lint with [Biome](https://biomejs.dev/) (`check --write`) |
| `pnpm format-and-lint:check:all` | Check only (no write) — used in CI |
| `pnpm with-env <command>` | Run a command with variables from root `.env` |
| `pnpm db:generate` / `db:push` / `db:studio` / `db:seed` | Database workflows (see `packages/db`) |

### Supabase CLI

- `supabase start` — start local Supabase
- `supabase stop` — stop local Supabase

### Environment variables

Create `.env` at the repository root. **`.env.example`** lists variables the apps and packages expect, with notes. Use `pnpm with-env` when a command needs those variables loaded (see root `package.json`).

### Supabase Auth URL configuration (invites + email links)

If you use **invited users** (admin invite emails) or **email-based auth links**, set these in the Supabase Dashboard:

- **Auth → URL Configuration**
  - **Site URL**: your app origin (local: `http://localhost:3000`)
  - **Redirect URLs**: include at least:
    - `http://localhost:3000/**` (local)
    - your deployed origin patterns (e.g. `https://your-domain.com/**`)

This repo’s invite flow uses a redirect target of **`{NEXT_PUBLIC_APP_URL}/login`** (see `packages/api/src/funcs/profiles.funcs.ts`), so that route must be allowed.

### Database migrations & seed (local)

- **Migrations**
  - Generate: `pnpm db:generate`
  - Apply/push: `pnpm db:push`
  - Studio: `pnpm db:studio`
- **Seed**
  - Local only: `pnpm db:seed`
  - Seeds create baseline org/profile/role data so you can log in and navigate immediately.

### Data model: Organizations + Profiles

- **`organizations`**: a workspace/tenant.
- **`profiles`**: a user *inside an organization* (multi-tenant membership row), linked to `auth.users` via `profiles.user_id`.
  - This is where org-scoped fields live (role, inactive flag, preferences, etc.).
  - Invited people can exist as a profile row before they confirm email; you can treat them as “pending” by checking `auth.users.invited_at` / `email_confirmed_at`.

## Operations (not included)

Wire these in your deployment or fork as needed:

| Area | Notes |
| ---- | ----- |
| **Email** | Resend (or other) — set `RESEND_API_KEY` / `RESEND_FROM_EMAIL` or configure in-app system settings where implemented. |
| **Error monitoring** | Not configured (e.g. Sentry) — add in `apps/web` and API. |
| **Backups** | Use Supabase/hosted Postgres backup policies; document RPO/RTO for your org. |

## License

See [`LICENCE.md`](LICENCE.md) in the repository root (filename uses **UK** spelling).

## AI-assisted development

The repo includes conventions for AI-assisted workflows (e.g. Cursor, Claude Code).

| Path | Purpose |
| ---- | ------- |
| `CLAUDE.md` | Project rules and patterns for agents |
| `docs/PROJECT_INTENT.md` | Your fork’s product goals (fill in; see [`docs/README.md`](docs/README.md)) |
| `ai/docs/` | Deeper documentation by area |
| `ai/knowledge/` | Notes and learnings |
| `.claude/skills/` | Reusable task patterns |

1. Read `CLAUDE.md` for standards.
2. Fill in or read `docs/PROJECT_INTENT.md` for product goals (forks); see `docs/README.md` for how `docs/` relates to `ai/docs/`.
3. Use `ai/docs/` for feature- or layer-specific technical detail.
4. Mirror existing patterns in `.claude/skills/` when adding similar code.

## Contact

Maintainer and support contacts are defined by your organization.
