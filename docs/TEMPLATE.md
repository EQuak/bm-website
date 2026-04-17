# What this repository is

This repo is a **generic application template**, not a finished product.

## Included in the template

- **Monorepo** (Turborepo): `apps/web`, shared `packages/*` (API, DB, UI).
- **Auth**: Supabase Auth; sign-up with email/password, org + profile creation.
- **Multi-tenant shell**: `organizations`, org-scoped `profiles`, URL prefix `/app/[org_slug]/...`.
- **API**: tRPC + Drizzle; patterns for protected procedures and Zod validation.
- **UI**: Mantine + Tailwind; workspace shell, settings stubs (profile, user roles, general settings, developer tools).
- **Database**: Drizzle schema + Supabase SQL migrations; optional seeds for local dev.

## Not included (add in your fork)

- Domain-specific modules (inventory, HR, ticketing, etc.).
- Production email templates beyond placeholders; configure Resend (or another provider) and `RESEND_FROM_EMAIL`.
- Error monitoring, analytics, backups — see [README](../README.md#operations-not-included).
- OAuth (Google/Apple) — removed from the template UI; re-add when needed.

## Placeholder UI (intentional)

The template uses **one consistent pattern**: dashboard and several settings areas are **minimal placeholders** (short copy, empty states, or “in progress”). That is enough to exercise navigation, auth, and layout—**forks replace or remove these as they add real features.** No need to strip them before forking unless you prefer a thinner shell.

## `apps/mobile`

Expo Router app with the same **ACL module keys** as the template (`dashboard`, `settings`, `settings-user-roles`), drawer nav aligned to web `siteConfig` (dashboard + settings subtree), and profile data from `profiles.getProfileByUserLogged`. Routes live under `/app/...` **without** a `[org_slug]` URL segment (see below).

**CI** runs `pnpm typecheck:ci`, which typechecks **all** workspaces including `mobile` (same command as in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)).

### URL shape vs web (plan before deep business logic)

On **web**, org context is carried in the path: `/app/[org_slug]/…`. **Mobile does not mirror that segment yet.** If the mobile app is first-class for v1, decide early how org is selected or implied (e.g. stored “current org”, deep links, or a future route shape)—**before** you rely on “org always comes from the URL” across every client.

## Fork workflow

1. Clone/fork and rename branding: root `package.json` `name` (e.g. `app-template` → your product), [`apps/web`](../apps/web) metadata (`siteConfig`, root layout title), and [`apps/mobile/app.config.ts`](../apps/mobile/app.config.ts) (`name`, `slug`, Android `package`) if you ship mobile. Fill in [`PROJECT_INTENT.md`](PROJECT_INTENT.md) so AI tools and contributors share the same product goals.
2. Copy `.env.example` → `.env` and fill values.
3. Run migrations and seed (local Supabase only for seed safety checks).
4. Implement business logic in new packages or `packages/api` routers and `packages/db` schema.
