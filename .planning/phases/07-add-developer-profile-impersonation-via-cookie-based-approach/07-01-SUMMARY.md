---
phase: 07-add-developer-profile-impersonation-via-cookie-based-approach
plan: 01
subsystem: api
tags: [trpc, drizzle, cookies, impersonation, profiles, developer-tools]

# Dependency graph
requires: []
provides:
  - getProfileByProfileId function in profiles.funcs.ts (queries by profile ID with full relations)
  - getProfileByUserLogged now reads dev_impersonation cookie and returns impersonated profile when valid
  - getRealProfile tRPC procedure always returns real user profile regardless of cookie state
  - js-cookie and @types/js-cookie installed in apps/web for Plan 02 frontend usage
affects:
  - 07-02 (frontend Developer Tools UI that reads/writes the dev_impersonation cookie)
  - Any consumer of getProfileByUserLogged (auth context, user menu, permissions)

# Tech tracking
tech-stack:
  added: [js-cookie@3.0.5, @types/js-cookie@3.0.6]
  patterns:
    - Cookie parsing from ctx.headers.get("cookie") in tRPC protectedProcedure (not next/headers cookies())
    - Cookie format realUserId:impersonatedProfileId for cross-user impersonation prevention
    - Graceful fallthrough — impersonation falls back to real profile on invalid/missing cookie

key-files:
  created: []
  modified:
    - packages/api/src/funcs/profiles.funcs.ts
    - packages/api/src/router/profiles.router.ts
    - apps/web/package.json

key-decisions:
  - "Parse cookie from ctx.headers.get('cookie') — NOT next/headers cookies() which is unreliable in tRPC context (per research)"
  - "Cookie format: realUserId:impersonatedProfileId — validates realUserId === ctx.user.id to prevent cross-user impersonation"
  - "getProfileByProfileId mirrors getProfileByUserId exactly — same with relations, different where clause"
  - "getRealProfile ignores cookie entirely — needed by Dev Tools UI to get realUserId for cookie construction"

patterns-established:
  - "Impersonation pattern: cookie-based profile swap at tRPC layer, transparent to all downstream callers"
  - "Cookie security: bind cookie to authenticated user ID, validate on every request"

requirements-completed: [IMPER-01]

# Metrics
duration: 1m 37s
completed: 2026-02-26
---

# Phase 7 Plan 01: Backend Impersonation Support Summary

**Cookie-based profile impersonation at tRPC layer — getProfileByUserLogged reads dev_impersonation cookie and swaps to impersonated profile, with getRealProfile always bypassing impersonation for Developer Tools UI**

## Performance

- **Duration:** 1m 37s
- **Started:** 2026-02-26T22:42:25Z
- **Completed:** 2026-02-26T22:44:02Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Added `getProfileByProfileId` to `profiles.funcs.ts` — identical shape to `getProfileByUserId` but queries by profile `id` instead of `user_id`, enabling lookup of any profile for impersonation
- Modified `getProfileByUserLogged` to parse `dev_impersonation` cookie from `ctx.headers`, validate it belongs to the authenticated user, and return the impersonated profile (falls through to real profile if cookie absent/invalid)
- Added `getRealProfile` tRPC procedure that always returns the real user's profile regardless of any cookie — needed by Developer Tools UI to construct the cookie value
- Installed `js-cookie` and `@types/js-cookie` in `apps/web` for Plan 02 frontend usage

## Task Commits

Each task was committed atomically:

1. **Task 1: Add getProfileByProfileId function and install js-cookie** - `11c5d4a5` (feat)
2. **Task 2: Modify getProfileByUserLogged to read impersonation cookie and add getRealProfile** - `6fd657b4` (feat)

## Files Created/Modified
- `packages/api/src/funcs/profiles.funcs.ts` - Added `getProfileByProfileId` function with same `with` relations as `getProfileByUserId`
- `packages/api/src/router/profiles.router.ts` - Added cookie parsing to `getProfileByUserLogged`, imported `getProfileByProfileId`, added `getRealProfile` procedure
- `apps/web/package.json` - Added `js-cookie` and `@types/js-cookie` dependencies

## Decisions Made
- Parse cookie from `ctx.headers.get("cookie")` not `next/headers cookies()` — per research, `cookies()` from next/headers is unreliable in tRPC context
- Cookie format `realUserId:impersonatedProfileId` — binding the cookie to the authenticated user ID prevents cross-user impersonation (if a different user logs in on the same browser, their real user ID won't match and impersonation is ignored)
- `getProfileByProfileId` is a clean mirror of `getProfileByUserId` — same `with` clause ensures impersonated profile has all the same data shape as a real profile
- `getRealProfile` intentionally ignores the cookie — Developer Tools page needs the real user's profile to build `realUserId:profileId` cookie value

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Backend impersonation support complete — Plan 02 can now build the Developer Tools UI (combobox to select a profile, set/clear the cookie, trigger full page refresh)
- `getRealProfile` ready to use for cookie construction in the UI
- `getProfileByUserLogged` transparently serves impersonated profile — all downstream consumers (auth context, user menu, permissions) will automatically use impersonated profile with no additional changes

---
*Phase: 07-add-developer-profile-impersonation-via-cookie-based-approach*
*Completed: 2026-02-26*
