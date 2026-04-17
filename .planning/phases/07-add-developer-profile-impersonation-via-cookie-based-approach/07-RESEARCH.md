# Phase 7: Add developer profile impersonation via cookie-based approach - Research

**Researched:** 2026-02-26
**Domain:** Next.js 15 App Router cookie mechanics, tRPC context modification, React Query cache invalidation
**Confidence:** HIGH

## Summary

This phase adds a developer-only tool that lets admin users "impersonate" another profile's identity for testing permissions and feature behavior. The implementation is a targeted, reversible swap of `profile_id` at the data-resolution layer — everything downstream (roles, permissions, menu items, data scoping) automatically follows without any other code changes.

The cookie is the source of truth. It is set on the client (or via a tRPC mutation), read on the server inside the `getProfileByUserLogged` procedure, and also readable by the browser for UI indicators without extra API calls. The cookie value encodes `realUserId:impersonatedProfileId` to prevent cross-user accidents. A full page refresh after activation or deactivation ensures no stale React Query cache state.

The implementation touches five distinct areas: (1) the backend `getProfileByUserLogged` procedure, (2) two new tRPC mutations (start/stop impersonation), (3) a new "Developer Tools" settings page, (4) a visual indicator on the sidebar user avatar, and (5) a "Stop Impersonating" button in the user menu dropdown. No database schema changes are required.

**Primary recommendation:** Read the impersonation cookie inside the existing `getProfileByUserLogged` procedure using `next/headers cookies()`, add two new mutations to the profiles router, build the Developer Tools page in the settings group, and modify the sidebar footer and user menu dropdown for visual indicator + stop button.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Cookie and session design:**
- Cookie scoped to current user — value includes both the real user ID and the impersonated profile ID (prevents accidental cross-user impersonation if someone else logs in)
- 24-hour expiry — persists across browser restarts for longer testing sessions
- Readable by both frontend and backend — frontend can read cookie directly for UI indicators without extra API calls
- Cookie mechanism (tRPC mutation vs client-side): Claude's discretion

**Impersonation scope:**
- Full profile swap — the impersonated profile_id replaces the real one everywhere
- Frontend auth context returns the impersonated profile_id instead of the real one
- Backend resolves the impersonated profile_id when looking up the user's profile
- All downstream behavior stays unchanged: roles, permissions, data scoping, menus, actions like "my tickets" all use the impersonated profile
- Can impersonate any profile — admin can impersonate anyone including other admins (simplest approach, admin already has full access)

**Admin UI location:**
- New "Developer Tools" page in the Settings sidebar, same level as "User Roles", "Certifications", etc.
- Only visible to users who can access admin settings (manage_all permission — already enforced by being inside settings)
- Combobox with profile details — shows name + role + department in search results for easy identification
- Full page refresh after selecting a profile to impersonate (cleanest, no stale state)

**Stopping impersonation:**
- "Stop Impersonating" button in the user menu popover (next to Feedback/Profile/Logout) — quick access from anywhere
- Also clearable from the Developer Tools page itself
- Both trigger a full page refresh

**Visual indicator:**
- Red badge/indicator on the user avatar in the sidebar/header — danger style, impossible to miss
- User menu avatar and name swap to the impersonated user's info — consistent with full profile swap
- Name+role display in the indicator: Claude's discretion

### Claude's Discretion

- Cookie mechanism: tRPC mutation vs. client-side cookie write
- Name+role display format in the impersonation indicator

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next/headers` | Next.js 16.1.x | Server-side cookie read | Built into Next.js App Router, already used in project |
| `next/navigation` | Next.js 16.1.x | `router.refresh()` for full page refresh | Already used throughout codebase |
| `@trpc/server` | catalog | New mutations for set/clear cookie | Already the project's API pattern |
| `js-cookie` | 3.x | Client-side cookie read/write | Lightweight; native `document.cookie` is verbose |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@mantine/core` (Indicator, Badge, Avatar, Select) | v7 | Visual indicator components | Already the project's UI library |
| `nuqs` | ^2.2.1 | URL state (NOT used here) | Excluded — impersonation is browser-local, not URL-shareable |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `js-cookie` | `document.cookie` directly | `document.cookie` API is verbose and error-prone; `js-cookie` is 800 bytes and handles all edge cases |
| `js-cookie` | `localStorage` | localStorage is not sent to the server; cookie is needed for SSR/API reads |
| tRPC mutation for cookie set | Client-side `document.cookie` / `js-cookie` | tRPC mutation goes through the server handler which has access to `cookies()` from `next/headers`, simplifying the cookie format and ensuring it is `HttpOnly` if desired; client-side is simpler but cookie must NOT be HttpOnly to be readable by the frontend indicator |

**Cookie must be readable by frontend JS** (for the sidebar indicator without an extra API call), so it MUST NOT be `HttpOnly`. This means client-side writes via `js-cookie` are viable and simpler. A tRPC mutation approach works too but offers no real advantage here since we do not need server validation before setting the cookie.

**Recommendation (Claude's discretion):** Use `js-cookie` on the client side for simplicity. The tRPC mutation approach adds a round trip with no benefit since the cookie value is not sensitive and needs to be client-readable.

**Installation:**
```bash
pnpm add js-cookie
pnpm add -D @types/js-cookie
```

---

## Architecture Patterns

### Recommended Project Structure

New files to create:

```
apps/web/src/app/(application)/app/(settings)/
└── developer-tools/
    └── page.tsx                          # Server Component (settings page entry)
    └── _components/
        └── DeveloperToolsContent.tsx     # Client Component with combobox + stop button
```

Changes to existing files:
```
packages/api/src/router/profiles.router.ts    # Add setImpersonation + clearImpersonation mutations
packages/api/src/funcs/profiles.funcs.ts      # Modify getProfileByUserId or add getProfileForSession
apps/web/src/core/config/site.ts              # Add "Developer Tools" nav link under Settings
apps/web/src/app/(application)/app/_components/user-menu-dropdown.tsx   # Add "Stop Impersonating" button + indicator
apps/web/src/app/(application)/app/_components/shell-sidebar.tsx        # Wrap avatar with red Indicator when impersonating
```

### Cookie Design

**Cookie name:** `dev_impersonation`
**Value format:** `{realUserId}:{impersonatedProfileId}`
**Expiry:** 24 hours (1 day)
**SameSite:** `Strict`
**HttpOnly:** `false` (must be readable by frontend JS)
**Path:** `/`

Validation on read: split on `:`, check `realUserId === ctx.user.id`. If mismatch (different user logged in), ignore the cookie entirely.

### Pattern 1: Backend — Read cookie in `getProfileByUserLogged`

**What:** Modify `getProfileByUserLogged` in `profiles.router.ts` to read the impersonation cookie from request headers and, if valid, call `getProfileById` on the impersonated profile ID instead of `getProfileByUserId`.
**When to use:** This is the single swap point. All downstream behavior follows automatically.

```typescript
// packages/api/src/router/profiles.router.ts

import { cookies } from "next/headers"

// Inside getProfileByUserLogged procedure:
getProfileByUserLogged: protectedProcedure.query(async ({ ctx }) => {
  // 1. Read impersonation cookie
  const cookieStore = await cookies()
  const impersonationCookie = cookieStore.get("dev_impersonation")?.value

  if (impersonationCookie) {
    const [realUserId, impersonatedProfileId] = impersonationCookie.split(":")
    // Only honor cookie if it matches the current authenticated user
    if (realUserId === ctx.user.id && impersonatedProfileId) {
      // Fetch the impersonated profile by its profile ID
      const impersonatedProfile = await getProfileByProfileId(ctx.db, {
        profileId: impersonatedProfileId
      })
      if (impersonatedProfile) {
        return impersonatedProfile
      }
    }
  }

  // Default: return the real user's profile
  return await getProfileByUserId(ctx.db, { userId: ctx.user.id })
}),
```

**Important:** The existing `getProfileByUserId` function fetches by `userId` (the Supabase Auth user ID). For impersonation, we need `getProfileById` (fetches by profile `id`) — this function already exists in `profiles.funcs.ts`.

However, `getProfileById` also fetches signed URLs for signature/photo which is not needed here. The better approach is to add a new `getProfileByProfileId` function that fetches with the same relations as `getProfileByUserId` but filtered by `ProfilesTable.id`.

### Pattern 2: New tRPC Mutations (optional — for server-side cookie set)

Since we decided to use client-side `js-cookie`, no new tRPC mutations are strictly needed. However, to follow the project's API-first pattern and keep cookie logic testable, two lightweight mutations can still be added:

```typescript
// packages/api/src/router/profiles.router.ts

setImpersonation: protectedProcedure
  .input(z.object({ profileId: z.string().uuid() }))
  .mutation(async ({ ctx, input }) => {
    // Validate the profile exists
    const profile = await ctx.db.query.ProfilesTable.findFirst({
      where: (P, { eq }) => eq(P.id, input.profileId),
      columns: { id: true }
    })
    if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" })
    // Return the cookie value to set — client sets the actual cookie
    return { cookieValue: `${ctx.user.id}:${input.profileId}` }
  }),

clearImpersonation: protectedProcedure.mutation(() => {
  // No-op on server; client clears the cookie
  return { success: true }
}),
```

**Alternative (simpler):** Skip tRPC mutations entirely. The Developer Tools page client component uses `js-cookie` to set/clear directly, then calls `router.refresh()`. This is acceptable since the cookie is not sensitive.

### Pattern 3: Frontend — Reading cookie for UI indicator

```typescript
// In shell-sidebar.tsx FooterUserButton (or a new hook)
import Cookies from "js-cookie"

const isImpersonating = (): boolean => {
  const cookie = Cookies.get("dev_impersonation")
  if (!cookie) return false
  // Don't need to validate realUserId here — the profile data already reflects
  // what the server resolved; just check if cookie exists
  return cookie.includes(":")
}
```

Since `getProfileByUserLogged` already returns the impersonated profile when the cookie is set, the sidebar's `profile` data (via `api.profiles.getProfileByUserLogged.useSuspenseQuery()`) will already show the impersonated user's name/avatar. The Indicator is just a visual overlay on the avatar.

### Pattern 4: Developer Tools Page

Follows the existing settings page pattern:

```typescript
// apps/web/src/app/(application)/app/(settings)/developer-tools/page.tsx
// Server Component — no layout.tsx needed (uses parent settings layout)

import { HydrateClient, api } from "#/trpc/server"
import { DeveloperToolsContent } from "./_components/DeveloperToolsContent"

export default async function DeveloperToolsPage() {
  void (await api.profiles.getAllProfilesAlphabetically.prefetch())
  return (
    <HydrateClient>
      <DeveloperToolsContent />
    </HydrateClient>
  )
}
```

```typescript
// _components/DeveloperToolsContent.tsx — Client Component
"use client"

import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { api } from "#/trpc/react"

export function DeveloperToolsContent() {
  const router = useRouter()
  const [profiles] = api.profiles.getAllProfilesAlphabetically.useSuspenseQuery()

  const currentCookie = Cookies.get("dev_impersonation")
  const isImpersonating = !!currentCookie

  const startImpersonation = (profileId: string) => {
    // Need to get the real user ID — use a separate query or pass from server
    // Option: read from a non-impersonated query, or pass realUserId as prop
    Cookies.set("dev_impersonation", `${realUserId}:${profileId}`, {
      expires: 1, // 1 day
      sameSite: "strict",
      path: "/"
    })
    router.refresh() // Full page refresh
  }

  const stopImpersonation = () => {
    Cookies.remove("dev_impersonation", { path: "/" })
    router.refresh()
  }

  // ... UI with Select combobox and Stop button
}
```

**Open question:** The client-side cookie set needs the `realUserId`. Options:
1. A separate tRPC query `profiles.getRealUserProfile` that bypasses impersonation (reads by `ctx.user.id` directly, ignoring the cookie)
2. Pass `realUserId` from the server component as a prop
3. Store `realUserId` in the cookie on first login (no — overkill)

**Recommendation:** Add a `getMyRealUserId` or `getRealProfile` procedure that always ignores the impersonation cookie and returns the actual authenticated user's profile. This is also useful for the sidebar stop button.

### Pattern 5: Visual Indicator in Sidebar

The `FooterUserButton` in `shell-sidebar.tsx` already shows the avatar. Wrap it with Mantine's `Indicator` component when impersonating:

```typescript
// shell-sidebar.tsx — FooterUserButton
import Cookies from "js-cookie"
import { Indicator } from "@repo/mantine-ui"

const FooterUserButton = () => {
  const [profile] = api.profiles.getProfileByUserLogged.useSuspenseQuery()
  const isImpersonating = !!Cookies.get("dev_impersonation")

  return (
    <Menu ...>
      <MenuTarget>
        <UnstyledButton ...>
          <Indicator
            disabled={!isImpersonating}
            color="red"
            size={12}
            processing
          >
            <Avatar src={profile?.avatar} ...>
              {profile?.firstName[0]}{profile?.lastName[0]}
            </Avatar>
          </Indicator>
          {/* name/email ... */}
        </UnstyledButton>
      </MenuTarget>
      <UserMenuDropdown profile={...} isImpersonating={isImpersonating} />
    </Menu>
  )
}
```

### Pattern 6: Stop Impersonating in UserMenuDropdown

```typescript
// user-menu-dropdown.tsx
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

export default function UserMenuDropdown({
  profile,
  isImpersonating
}: {
  profile: { firstName: string; lastName: string; avatar?: string; email: string }
  isImpersonating?: boolean
}) {
  const router = useRouter()

  const stopImpersonation = () => {
    Cookies.remove("dev_impersonation", { path: "/" })
    router.refresh()
  }

  return (
    <MenuDropdown>
      {/* ... existing items ... */}
      {isImpersonating && (
        <>
          <MenuDivider />
          <MenuItem
            color="red"
            leftSection={<IconUserOff size={16} />}
            onClick={stopImpersonation}
          >
            Stop Impersonating
          </MenuItem>
        </>
      )}
    </MenuDropdown>
  )
}
```

### Pattern 7: Site Config — Adding Developer Tools nav link

```typescript
// apps/web/src/core/config/site.ts — inside the Settings links array
{
  label: "Developer Tools",
  href: "/developer-tools",
  permissions: [
    {
      permission: "settings",  // Already required to be in settings
      actions: ["view"]
    }
  ]
}
```

The settings layout (`/settings/layout.tsx`) already enforces `ability.can("view", "settings")`. Developer Tools sits inside this protected route group, so no additional permission check is needed. The "developer" role gets `can("manage", "all")` via `ability.ts`, which covers all settings access.

### Anti-Patterns to Avoid

- **HttpOnly cookies:** Frontend cannot read `HttpOnly` cookies via JS. The indicator would need an extra API call on every render. Keep the cookie non-HttpOnly.
- **Invalidating React Query cache manually:** The `router.refresh()` call re-renders Server Components and resets the tRPC prefetch cache cleanly. Do NOT use `queryClient.invalidateQueries()` — it only refetches on the client, not the server-resolved data.
- **Storing impersonation in Zustand/useState:** State is lost on refresh and doesn't persist across browser restarts. Cookie is the right storage.
- **Modifying the Supabase Auth session:** Impersonation should only affect profile resolution, not the underlying auth identity. Never modify `ctx.user.id`.
- **Using localStorage:** Not sent to server; breaks SSR impersonation.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cookie read/write | Custom cookie parser | `js-cookie` (client) + `next/headers cookies()` (server) | Handles encoding, expiry, SameSite, path correctly |
| Profile combobox with search | Custom search input | Mantine `Select` with `searchable` prop | Already used in project; handles keyboard nav, filtering |
| Permission guard for settings page | Custom auth check | Parent `/settings/layout.tsx` already enforces `settings` permission | Adding another check is redundant |
| Full page refresh | `queryClient.invalidateQueries()` | `router.refresh()` from `next/navigation` | Server Components re-render; tRPC hydration cache is fresh |

**Key insight:** The profile swap is a one-line change in `getProfileByUserLogged`. All permission/data scoping complexity is already handled by the existing pipeline — this phase just inserts a redirect at the right point.

---

## Common Pitfalls

### Pitfall 1: Cookie not readable on server inside tRPC handler
**What goes wrong:** `cookies()` from `next/headers` works in Server Components and Route Handlers, but may not be available inside the tRPC `fetchRequestHandler` context in `apps/web/src/app/api/trpc/[trpc]/route.ts`.
**Why it happens:** `cookies()` relies on the Next.js request context. In the App Router tRPC handler, the request is passed through `fetchRequestHandler`, which may not set up the cookie store automatically.
**How to avoid:** Pass the cookie header explicitly through `createTRPCContext`. The `req.headers` already include `Cookie`, so `cookies()` should work since it reads from the same async context — but verify this. Alternative: read cookies from `ctx.headers.get("cookie")` and parse manually in the procedure.
**Warning signs:** `cookies()` throws "cookies was called outside a request scope" — fall back to parsing `ctx.headers.get("cookie")` directly.

```typescript
// Fallback: parse cookie from header if next/headers cookies() doesn't work in tRPC
function getImpersonationCookie(headers: Headers, realUserId: string): string | null {
  const cookieHeader = headers.get("cookie") ?? ""
  const match = cookieHeader.match(/dev_impersonation=([^;]+)/)
  if (!match) return null
  const [savedUserId, profileId] = decodeURIComponent(match[1] ?? "").split(":")
  if (savedUserId !== realUserId) return null
  return profileId ?? null
}
```

**Verification:** The `createTRPCContext` receives `opts.headers` from the request. This is the safest way to read cookies in tRPC procedures, since `next/headers cookies()` is only guaranteed inside Server Components and Route Handlers.

### Pitfall 2: Stale profile data after impersonation
**What goes wrong:** After setting the cookie and calling `router.refresh()`, the React Query cache on the client may still hold the old profile data for a moment, causing a flash.
**Why it happens:** `useSuspenseQuery` with `gcTime: 1000 * 60 * 60 * 24` (24h) means cached data persists.
**How to avoid:** `router.refresh()` triggers a re-render of Server Components which invalidates the tRPC hydration cache. The client React Query cache will be overwritten by the fresh server data on the next render. This is the correct approach — the `AppContext.tsx` uses `gcTime: 1000 * 60 * 60 * 24, staleTime: 1000 * 60 * 15`. After `router.refresh()`, the server-prefetched data overwrites the cache.
**Warning signs:** Avatar/name shows old profile after impersonation — add `queryClient.invalidateQueries({ queryKey: ... })` as a fallback before `router.refresh()`.

### Pitfall 3: Cookie includes realUserId but getCurrentUser returns impersonated profile
**What goes wrong:** If the server uses the impersonated profile_id for `ctx.user.id` in other procedures, they will fail or return wrong data.
**Why it happens:** Confusion between the Supabase Auth user ID (`ctx.user.id`) and the profile ID.
**How to avoid:** The impersonation ONLY affects `getProfileByUserLogged`. `ctx.user.id` remains the real Supabase Auth user ID throughout the request. Only the profile lookup result changes. Never replace `ctx.user.id` with the impersonated profile's `userId`.

### Pitfall 4: Developer Tools page accessible to non-admin users
**What goes wrong:** Any user who can view settings can access Developer Tools.
**Why it happens:** The settings layout only checks `ability.can("view", "settings")`, which ALL authenticated users have (see `ability.ts` line 69: `can("view", "settings")` is granted universally).
**How to avoid:** Add an explicit permission check in the Developer Tools page itself, or gate it on `roleSlug === "developer"`. The Context says "Only visible to users who can access admin settings (manage_all permission — already enforced by being inside settings)" — but since `settings` permission is universal, a more specific check is needed.

**Recommended approach:** Check for `developer` role slug in the page layout or component:
```typescript
// In developer-tools/page.tsx
const profile = await api.profiles.getProfileByUserLogged()
if (profile.aclRole !== "developer") redirect("/settings")
```

Or add a `manage_all` permission check using CASL: `ability.can("manage", "all")`.

### Pitfall 5: `router.refresh()` in Next.js 15 + React 19 behavior
**What goes wrong:** `router.refresh()` from `next/navigation` may not re-execute Server Components in some edge cases with concurrent rendering in React 19.
**Why it happens:** React 19 has changed how transitions work.
**How to avoid:** `router.refresh()` is the correct API for this use case. It marks the current route as stale and re-fetches server-rendered content. This is well-established in Next.js 15 App Router. Confidence: HIGH — this is the standard pattern.

---

## Code Examples

### Reading cookie in tRPC procedure (safest approach)

```typescript
// packages/api/src/router/profiles.router.ts

getProfileByUserLogged: protectedProcedure.query(async ({ ctx }) => {
  // Parse impersonation cookie from request headers
  const cookieHeader = ctx.headers.get("cookie") ?? ""
  const impersonationMatch = cookieHeader.match(/dev_impersonation=([^;]+)/)

  if (impersonationMatch) {
    const cookieValue = decodeURIComponent(impersonationMatch[1] ?? "")
    const [realUserId, impersonatedProfileId] = cookieValue.split(":")

    if (realUserId === ctx.user.id && impersonatedProfileId) {
      const impersonatedProfile = await getProfileByProfileId(ctx.db, {
        id: impersonatedProfileId
      })
      if (impersonatedProfile) return impersonatedProfile
    }
  }

  return await getProfileByUserId(ctx.db, { userId: ctx.user.id })
}),
```

### New `getProfileByProfileId` function

```typescript
// packages/api/src/funcs/profiles.funcs.ts

export async function getProfileByProfileId(
  db: DBClient,
  { id }: { id: string }
) {
  return db.query.ProfilesTable.findFirst({
    where: (Profiles, { eq }) => eq(Profiles.id, id),
    with: {
      employeeInformation: {
        with: {
          jobPositionInfo: true
        }
      },
      user: {
        columns: { email: true }
      },
      _aclRole: {
        with: { _permissions: true }
      }
    }
  })
}
```

### Setting cookie (client-side, Developer Tools page)

```typescript
"use client"

import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

const COOKIE_NAME = "dev_impersonation"
const COOKIE_EXPIRY_DAYS = 1

function startImpersonation(realUserId: string, targetProfileId: string) {
  Cookies.set(COOKIE_NAME, `${realUserId}:${targetProfileId}`, {
    expires: COOKIE_EXPIRY_DAYS,
    sameSite: "strict",
    path: "/"
  })
}

function stopImpersonation() {
  Cookies.remove(COOKIE_NAME, { path: "/" })
}
```

### Checking impersonation status on client (for visual indicator)

```typescript
import Cookies from "js-cookie"

export function useImpersonationState(): {
  isImpersonating: boolean
  impersonatedProfileId: string | null
} {
  const cookie = Cookies.get("dev_impersonation")
  if (!cookie || !cookie.includes(":")) {
    return { isImpersonating: false, impersonatedProfileId: null }
  }
  const [, profileId] = cookie.split(":")
  return { isImpersonating: true, impersonatedProfileId: profileId ?? null }
}
```

### Mantine Indicator for avatar in shell-sidebar.tsx

```typescript
// Inside FooterUserButton
import { Indicator } from "@repo/mantine-ui"

<Indicator
  disabled={!isImpersonating}
  color="red"
  size={12}
  position="bottom-end"
  withBorder
  processing  // Animated pulse for visibility
>
  <Avatar ...>{initials}</Avatar>
</Indicator>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Server-side session storage for impersonation | Client-readable cookie | N/A — this is a new feature | Cookie is simpler, per-browser, no DB needed |
| `cookies()` from `next/headers` in tRPC | Parse from `ctx.headers.get("cookie")` | Next.js 15 | More reliable in tRPC context |
| `router.push()` with query params | `router.refresh()` | Next.js 13+ App Router | Cleanest full re-render without URL pollution |

---

## Open Questions

1. **Can `cookies()` from `next/headers` be used inside tRPC procedures?**
   - What we know: `createTRPCContext` receives `headers` as a parameter. The `next/headers` `cookies()` function works in the async context of App Router handlers.
   - What's unclear: Whether the tRPC `fetchRequestHandler` properly chains the async context so `cookies()` resolves correctly.
   - Recommendation: Use `ctx.headers.get("cookie")` parsing as the fallback. It is guaranteed to work since headers are always passed to `createTRPCContext`. This avoids any async context issues.

2. **Access control for Developer Tools page**
   - What we know: `ability.can("view", "settings")` is granted to ALL authenticated users. The context says "only visible to users who can access admin settings."
   - What's unclear: The exact intended gate — should it be `roleSlug === "developer"`, or `ability.can("manage", "all")`?
   - Recommendation: Gate on `profile.aclRole === "developer"` in the page component. This is explicit, matches the feature name ("Developer Tools"), and avoids exposing it to regular admins.

3. **`getProfileByUserLogged` is called in the workspace layout server component — does the cookie read work at SSR time?**
   - What we know: The workspace layout uses `await api.profiles.getProfileByUserLogged()` via the RSC caller (`trpc/server.ts`). At SSR time, `headers()` is fully available.
   - What's unclear: Whether the cookie is present in `ctx.headers` when the RSC caller is used.
   - Recommendation: HIGH confidence this works. The RSC caller creates context with `new Headers(await headers())`, which includes all cookies. The cookie will be present. Confidence: HIGH.

---

## Validation Architecture

> Skipped — `workflow.nyquist_validation` is not present in `.planning/config.json` (not set to `true`).

---

## Implementation Checklist for Planner

The planner should structure tasks around these five work areas:

1. **Backend:** Add `getProfileByProfileId` to `profiles.funcs.ts` + modify `getProfileByUserLogged` in `profiles.router.ts` to read the impersonation cookie from `ctx.headers`
2. **Real user profile procedure:** Add `getRealProfile` (or `getMyRealUserId`) procedure that always returns the real user's profile (ignores cookie) — needed by Developer Tools page to get `realUserId` for cookie value
3. **Developer Tools page:** New settings page at `/developer-tools` with profile combobox (using `getAllProfilesAlphabetically`) + stop button + permission gate (`aclRole === "developer"`)
4. **Navigation:** Add "Developer Tools" link in `site.ts` under Settings links
5. **Visual indicator + Stop button:** Modify `shell-sidebar.tsx` (Indicator on avatar) and `user-menu-dropdown.tsx` (Stop Impersonating MenuItem) using `js-cookie` to check/clear cookie + `router.refresh()`

---

## Sources

### Primary (HIGH confidence)
- Codebase: `/packages/api/src/trpc.ts` — `createTRPCContext` receives `headers` from request; cookie header available via `ctx.headers.get("cookie")`
- Codebase: `/apps/web/src/app/api/trpc/[trpc]/route.ts` — `createContext` passes `req.headers` which includes Cookie header
- Codebase: `/apps/web/src/trpc/server.ts` — RSC caller creates context with `new Headers(await headers())`
- Codebase: `/packages/api/src/router/profiles.router.ts` — `getProfileByUserLogged` is the single point to intercept
- Codebase: `/apps/web/src/core/context/AppContext.tsx` — profile is consumed from `getProfileByUserLogged.useSuspenseQuery()`
- Codebase: `/apps/web/src/core/context/rbac/ability.ts` — `developer` role gets `can("manage", "all")`; `can("view", "settings")` is universal
- Codebase: `/apps/web/src/app/(application)/app/_components/shell-sidebar.tsx` — `FooterUserButton` is where avatar indicator goes
- Codebase: `/apps/web/src/app/(application)/app/_components/user-menu-dropdown.tsx` — stop button placement

### Secondary (MEDIUM confidence)
- Next.js 15 docs: `router.refresh()` triggers re-render of Server Components and resets hydrated cache — standard pattern for "invalidate all" after cookie change
- Mantine v7 `Indicator` component supports `processing` (animated pulse) and `disabled` props

### Tertiary (LOW confidence)
- `cookies()` from `next/headers` inside tRPC route handler — untested; `ctx.headers.get("cookie")` is safer and equally functional

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries except `js-cookie`; everything else already in the project
- Architecture: HIGH — all patterns derived directly from codebase inspection
- Pitfalls: HIGH for pitfalls 2-5; MEDIUM for pitfall 1 (cookie read in tRPC; ctx.headers approach removes the risk)

**Research date:** 2026-02-26
**Valid until:** 2026-03-28 (stable patterns; Next.js/Mantine API unlikely to change)
