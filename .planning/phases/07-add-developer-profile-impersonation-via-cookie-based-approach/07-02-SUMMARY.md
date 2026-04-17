---
phase: 07-add-developer-profile-impersonation-via-cookie-based-approach
plan: 02
subsystem: ui
tags: [react, mantine, js-cookie, impersonation, developer-tools, sidebar, navigation, settings]

# Dependency graph
requires:
  - phase: 07-01
    provides: getRealProfile tRPC procedure and cookie-based getProfileByUserLogged backend swap
provides:
  - Developer Tools settings page at /settings/developer-tools with searchable profile combobox
  - Red pulsing Indicator on sidebar avatar when dev_impersonation cookie is active
  - Stop Impersonating menu item in UserMenuDropdown that clears cookie and performs hard reload
  - Developer Tools nav link in settings sidebar (empty permissions array, page-level role gate)
  - window.location.reload() pattern for profile/role swaps (avoids React hook mismatch on hard role changes)
affects:
  - Any future settings page additions (follow same nav link pattern with empty permissions + page redirect)
  - Any future impersonation UI changes (read dev_impersonation cookie client-side in useEffect)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Read cookie in useEffect not during render to avoid hydration mismatch (cookie is client-only)
    - Pass isImpersonating as prop from FooterUserButton to UserMenuDropdown to avoid double cookie read
    - window.location.reload() for profile/role swaps instead of router.refresh() (hard reload required when role context changes)
    - Empty permissions array on nav link + redirect() in page.tsx for role-gated settings pages
    - Mantine Indicator with processing prop for animated pulse visual indicator

key-files:
  created:
    - apps/web/src/app/(application)/app/(settings)/developer-tools/page.tsx
    - apps/web/src/app/(application)/app/(settings)/developer-tools/_components/DeveloperToolsContent.tsx
  modified:
    - apps/web/src/core/config/site.ts
    - apps/web/src/app/(application)/app/_components/shell-sidebar.tsx
    - apps/web/src/app/(application)/app/_components/shell-sidebar-mobile.tsx
    - apps/web/src/app/(application)/app/_components/user-menu-dropdown.tsx

key-decisions:
  - "Read cookie in useEffect to avoid hydration mismatch — cookie is client-only, not available during SSR"
  - "isImpersonating passed as prop from FooterUserButton to UserMenuDropdown — avoids double cookie read on every render"
  - "Developer Tools nav link uses empty permissions array — page itself handles developer role gate via redirect()"
  - "window.location.reload() instead of router.refresh() — hard reload required when profile/role changes to avoid React hook mismatch during context swap"

patterns-established:
  - "Hydration-safe cookie read: always read cookies in useEffect, never during render"
  - "Role-gated settings pages: add nav link with empty permissions, use redirect() in page.tsx after role check"
  - "Hard reload on identity swap: window.location.reload() when changing profile/role context"

requirements-completed: [IMPER-02]

# Metrics
duration: ~10min (including post-checkpoint fixes and human verification)
completed: 2026-02-26
---

# Phase 7 Plan 02: Frontend Impersonation UI Summary

**Complete developer impersonation UI — Developer Tools settings page with searchable profile combobox, red pulsing sidebar avatar indicator, and Stop Impersonating button in user menu, all using js-cookie with window.location.reload() for reliable profile swaps**

## Performance

- **Duration:** ~10 min (tasks 1-2 automated, task 3 human verification with post-checkpoint fixes)
- **Started:** 2026-02-26T22:46:29Z
- **Completed:** 2026-02-26 (after human verification and post-checkpoint fixes)
- **Tasks:** 3 (2 auto + 1 checkpoint:human-verify)
- **Files modified:** 6

## Accomplishments
- Created Developer Tools settings page (`/settings/developer-tools`) with server-side developer role gate via `redirect()`, prefetches all profiles for the combobox, and wraps `DeveloperToolsContent` in `HydrateClient`
- Created `DeveloperToolsContent` client component with Mantine `Select` (searchable) listing all profiles as "firstName lastName — roleName — department", sets `dev_impersonation` cookie on profile select and performs `window.location.reload()` for hard refresh
- Added red pulsing `Indicator` (Mantine, `processing` prop) on sidebar avatar in `FooterUserButton` and `FooterUserButtonMobile`, reads `dev_impersonation` cookie in `useEffect` to avoid hydration mismatch
- Added "Stop Impersonating" `Menu.Item` (red, `IconUserOff`) to `UserMenuDropdown` that clears cookie and performs `window.location.reload()`
- Added Developer Tools nav link to settings sidebar in `site.ts` with empty permissions array (page handles gating)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Developer Tools settings page with profile combobox and nav link** - `3adb66b0` (feat)
2. **Task 2: Add visual indicator on sidebar avatar and Stop Impersonating button in user menu** - `782b6ae0` (feat)
3. **Post-checkpoint fixes: window.location.reload, hydration error, unused imports** - `acaf808e` (fix)

**Plan checkpoint metadata:** `b17f6627` (docs: checkpoint pause)

## Files Created/Modified
- `apps/web/src/app/(application)/app/(settings)/developer-tools/page.tsx` - Server component with `getRealProfile` call, developer role gate via `redirect()`, profile list prefetch, wraps `DeveloperToolsContent`
- `apps/web/src/app/(application)/app/(settings)/developer-tools/_components/DeveloperToolsContent.tsx` - Client component with searchable profile `Select`, impersonation status badge, set/clear cookie logic, `window.location.reload()`
- `apps/web/src/core/config/site.ts` - Added Developer Tools nav entry to settings links array with `IconCode` icon and empty permissions
- `apps/web/src/app/(application)/app/_components/shell-sidebar.tsx` - Added Mantine `Indicator` with `processing` prop around Avatar in `FooterUserButton`, reads cookie in `useEffect`, passes `isImpersonating` prop to `UserMenuDropdown`
- `apps/web/src/app/(application)/app/_components/shell-sidebar-mobile.tsx` - Same indicator changes as desktop sidebar for mobile parity
- `apps/web/src/app/(application)/app/_components/user-menu-dropdown.tsx` - Added `isImpersonating` prop, conditional "Stop Impersonating" menu item with `IconUserOff`, clears cookie and calls `window.location.reload()`

## Decisions Made
- Read cookie in `useEffect` not during render — cookie is client-only (not available during SSR), reading it during render causes React hydration mismatch between server-rendered HTML and client state
- `isImpersonating` passed as a prop from `FooterUserButton` down to `UserMenuDropdown` — avoids reading the cookie twice on each render cycle; single source of truth per render
- Developer Tools nav link uses empty `permissions` array — the page itself calls `redirect()` after checking `profile.aclRole !== "developer"`, keeping the role gate co-located with the page rather than spread across config
- `window.location.reload()` instead of `router.refresh()` — when the profile/role changes, React Query cache, Zustand stores, and rendered component tree all hold stale data from the old identity; a hard reload ensures a clean slate with no hook mismatch errors

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Replaced router.refresh() with window.location.reload() for profile swaps**
- **Found during:** Human verification (Task 3 — post-checkpoint fix)
- **Issue:** `router.refresh()` caused React hook mismatch errors when the impersonated profile had a different role than the real user, because cached component state and React Query data from the old identity remained in memory during the soft refresh
- **Fix:** Replaced all `router.refresh()` calls with `window.location.reload()` in both `DeveloperToolsContent.tsx` and `user-menu-dropdown.tsx`; removed now-unused `useRouter` imports from both files
- **Files modified:** `apps/web/src/app/(application)/app/(settings)/developer-tools/_components/DeveloperToolsContent.tsx`, `apps/web/src/app/(application)/app/_components/user-menu-dropdown.tsx`
- **Verification:** User confirmed impersonation flow works end-to-end without errors after fix
- **Committed in:** `acaf808e`

**2. [Rule 1 - Bug] Fixed hydration error in Text component**
- **Found during:** Human verification (Task 3 — post-checkpoint fix)
- **Issue:** Mantine `<Text>` renders as `<p>` by default; nesting it inside a parent `<p>` element produced an invalid HTML nesting hydration error in the browser console
- **Fix:** Added `component="div"` prop to the `<Text>` element to render as `<div>` instead of `<p>`
- **Files modified:** `apps/web/src/app/(application)/app/(settings)/developer-tools/_components/DeveloperToolsContent.tsx`
- **Verification:** No hydration errors in browser console after fix
- **Committed in:** `acaf808e`

---

**Total deviations:** 2 auto-fixed (2 Rule 1 - Bug)
**Impact on plan:** Both fixes required for correct operation — the router.refresh() issue caused visible errors on profile swap, the hydration error appeared in console. No scope creep.

## Issues Encountered
- `router.refresh()` from Next.js performs a soft refresh that preserves React state — when swapping user identity this is insufficient because stale role/permission context causes hook mismatch errors. Switched to `window.location.reload()` which fully resets the JavaScript runtime state.
- Biome lint-staged pre-commit hook flagged import ordering in `DeveloperToolsContent.tsx` during initial commit — auto-fixed with `pnpm biome check --write` before re-committing.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 7 (developer profile impersonation) fully complete — both plans delivered and verified end-to-end by human
- Impersonation works transparently across the entire app: all tRPC queries return impersonated profile data, navigation/permissions reflect impersonated role, visual indicator is unmistakable
- Pattern established for future role-gated settings pages: empty permissions on nav link + page-level redirect check
- Pattern established for any future identity/context swaps: use `window.location.reload()` not `router.refresh()`
- No blockers for next phases (3: Welcome Pages, 4: Mobile Infrastructure)

---
*Phase: 07-add-developer-profile-impersonation-via-cookie-based-approach*
*Completed: 2026-02-26*
