---
phase: 07-add-developer-profile-impersonation-via-cookie-based-approach
verified: 2026-02-26T23:26:08Z
status: passed
score: 8/8 must-haves verified
gaps: []
---

# Phase 7: Developer Profile Impersonation Verification Report

**Phase Goal:** Developer users can impersonate any profile via a cookie-based swap, with full visual indicators and easy stop mechanism
**Verified:** 2026-02-26T23:26:08Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #  | Truth                                                                                 | Status     | Evidence                                                                                                                                               |
|----|---------------------------------------------------------------------------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1  | Developer user can select any profile to impersonate via searchable combobox          | VERIFIED   | `DeveloperToolsContent.tsx` has Mantine `Select` with `searchable`, populated from `getAllProfilesAlphabetically`, `onChange={handleProfileSelect}`    |
| 2  | Impersonated profile replaces real one everywhere (roles, permissions, data scoping)  | VERIFIED   | `getProfileByUserLogged` in `profiles.router.ts` reads cookie, calls `getProfileByProfileId`, returns impersonated profile transparently               |
| 3  | Red pulsing indicator on sidebar avatar makes impersonation status unmistakable       | VERIFIED   | `shell-sidebar.tsx` wraps Avatar in Mantine `Indicator` with `processing` prop, `disabled={!isImpersonating}`, cookie read in `useEffect`              |
| 4  | Stop Impersonating button in user menu clears cookie and restores real profile        | VERIFIED   | `user-menu-dropdown.tsx` has conditional `MenuItem` with `IconUserOff`, calls `Cookies.remove("dev_impersonation")` + `window.location.reload()`       |
| 5  | Non-developer users cannot see or access Developer Tools page                         | VERIFIED   | `developer-tools/page.tsx` calls `getRealProfile()`, redirects to `/settings` when `aclRole !== "developer"`                                           |
| 6  | Cookie persists across page navigation and browser restarts (24-hour expiry)          | VERIFIED   | `DeveloperToolsContent.tsx` sets cookie with `expires: 1` (1 day), `sameSite: "strict"`, `path: "/"`                                                   |
| 7  | Mobile sidebar shows red indicator when impersonating (parity with desktop)           | VERIFIED   | `shell-sidebar-mobile.tsx` imports `Indicator`, `Cookies`, `useEffect`, sets `isImpersonating` from cookie, wraps Avatar with `Indicator processing`   |
| 8  | getRealProfile always bypasses impersonation for Developer Tools gating                | VERIFIED   | `getRealProfile` procedure in `profiles.router.ts` calls `getProfileByUserId` directly, contains no cookie parsing logic                               |

**Score:** 8/8 truths verified

### Required Artifacts

| Artifact                                                                                                                        | Expected                                             | Status     | Details                                                                                                          |
|---------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------|------------|------------------------------------------------------------------------------------------------------------------|
| `packages/api/src/funcs/profiles.funcs.ts`                                                                                      | `getProfileByProfileId` function (mirrors getByUserId) | VERIFIED | Lines 296-320: queries by `Profiles.id`, identical `with` relations (`employeeInformation`, `user`, `_aclRole`) |
| `packages/api/src/router/profiles.router.ts`                                                                                    | Cookie parsing in `getProfileByUserLogged`           | VERIFIED   | Lines 127-151: regex match on `dev_impersonation`, validates `realUserId === ctx.user.id`, falls through on invalid |
| `packages/api/src/router/profiles.router.ts`                                                                                    | `getRealProfile` procedure                           | VERIFIED   | Lines 153-161: calls `getProfileByUserId(ctx.db, { userId: ctx.user.id })`, no cookie parsing                   |
| `apps/web/src/app/(application)/app/(settings)/developer-tools/page.tsx`                                                        | Server page with developer role gate                 | VERIFIED   | 27 lines: `getRealProfile()` call, `redirect("/settings")` guard, profile list prefetch, `HydrateClient` wrap   |
| `apps/web/src/app/(application)/app/(settings)/developer-tools/_components/DeveloperToolsContent.tsx`                          | Client component with profile combobox               | VERIFIED   | 193 lines: `Select searchable`, set/clear cookie via `js-cookie`, `window.location.reload()`, active status badge |
| `apps/web/src/core/config/site.ts`                                                                                              | Developer Tools nav entry in settings links          | VERIFIED   | Lines 776-781: `label: "Developer Tools"`, `href: "/developer-tools"`, `icon: IconCode`, `permissions: []`      |
| `apps/web/src/app/(application)/app/_components/shell-sidebar.tsx`                                                              | Red pulsing Indicator on avatar                      | VERIFIED   | Lines 81-86: `useState(false)` for impersonation, `useEffect` reads cookie, `Indicator processing` around Avatar |
| `apps/web/src/app/(application)/app/_components/shell-sidebar-mobile.tsx`                                                       | Same indicator changes as desktop                    | VERIFIED   | Lines 116-162: identical pattern to desktop — `isImpersonating` state, cookie read in `useEffect`, `Indicator`  |
| `apps/web/src/app/(application)/app/_components/user-menu-dropdown.tsx`                                                         | Stop Impersonating button                            | VERIFIED   | Lines 34-37: `handleStopImpersonating` removes cookie + `window.location.reload()`, conditional render at line 71 |
| `apps/web/package.json`                                                                                                          | `js-cookie` and `@types/js-cookie` installed         | VERIFIED   | `"js-cookie": "^3.0.5"` and `"@types/js-cookie": "^3.0.6"` present                                             |

### Key Link Verification

| From                                     | To                                       | Via                                              | Status   | Details                                                                                                |
|------------------------------------------|------------------------------------------|--------------------------------------------------|----------|--------------------------------------------------------------------------------------------------------|
| `getProfileByUserLogged` (router)        | `getProfileByProfileId` (funcs)          | Cookie regex match + userId validation           | WIRED    | `impersonationMatch` on line 131 → `getProfileByProfileId(ctx.db, { id: impersonatedProfileId })`    |
| `DeveloperToolsContent.tsx`              | `api.profiles.getAllProfilesAlphabetically` | `useSuspenseQuery()` in client component        | WIRED    | Line 41-42: `const [profiles] = api.profiles.getAllProfilesAlphabetically.useSuspenseQuery()`          |
| `developer-tools/page.tsx`               | `api.profiles.getRealProfile`            | `await api.profiles.getRealProfile()` server call | WIRED    | Line 12: `const realProfile = await api.profiles.getRealProfile()`                                    |
| `DeveloperToolsContent.tsx`              | Cookie (`dev_impersonation`)             | `Cookies.set()` on profile select               | WIRED    | Line 78: `Cookies.set(IMPERSONATION_COOKIE, \`${realUserId}:${profileId}\`, { expires: 1, ... })`     |
| `shell-sidebar.tsx` `FooterUserButton`   | `UserMenuDropdown`                       | `isImpersonating` prop                           | WIRED    | Line 130: `<UserMenuDropdown isImpersonating={isImpersonating} ... />`                                 |
| `UserMenuDropdown`                       | Cookie clear + reload                    | `Cookies.remove()` + `window.location.reload()`  | WIRED    | Lines 34-37: `handleStopImpersonating` wired to `onClick` of conditional `MenuItem` at line 71        |

### Requirements Coverage

| Requirement | Status      | Blocking Issue |
|-------------|-------------|----------------|
| IMPER-01    | SATISFIED   | Backend pipeline complete: `getProfileByProfileId`, cookie parsing in `getProfileByUserLogged`, `getRealProfile` procedure, all wired and substantive |
| IMPER-02    | SATISFIED   | Frontend complete: Developer Tools page with combobox, red pulsing Indicator on both desktop+mobile avatars, Stop Impersonating in user menu, nav link with permissions gate |

### Anti-Patterns Found

No blocker or warning anti-patterns found in phase files.

| File                          | Line | Pattern | Severity | Impact |
|-------------------------------|------|---------|----------|--------|
| (none)                        | -    | -       | -        | -      |

### Human Verification Required

The following behaviors were already verified by a human during plan 07-02 Task 3 checkpoint (noted in SUMMARY):

1. **Profile Swap Works End-to-End**
   - Test: Select a profile from combobox in Developer Tools, observe page reload and UI change
   - Expected: All UI shows impersonated profile's data, menus reflect impersonated role
   - Already verified: User confirmed during 07-02 human checkpoint

2. **Stop Impersonating Restores Real Profile**
   - Test: Click Stop Impersonating in user menu dropdown
   - Expected: Cookie cleared, page reloads, UI reverts to real user profile
   - Already verified: User confirmed during 07-02 human checkpoint

3. **Red Pulsing Indicator Visible on Avatar**
   - Test: Impersonate any profile and observe sidebar avatar
   - Expected: Red pulsing Mantine Indicator appears on avatar corner
   - Already verified: User confirmed no hydration errors after post-checkpoint fix

### Summary

Phase 7 goal is fully achieved. All 8 observable truths are verified against actual codebase artifacts. The cookie-based impersonation pipeline is correctly wired end-to-end:

- Backend: `getProfileByProfileId` mirrors `getProfileByUserId` with identical relations. `getProfileByUserLogged` parses `dev_impersonation` cookie, validates the cookie is bound to the authenticated user's ID, and transparently returns the impersonated profile — making the swap invisible to all downstream consumers. `getRealProfile` intentionally skips cookie logic for Developer Tools gating.

- Frontend: Developer Tools page gates on real profile's `aclRole === "developer"` via server-side `redirect()`. The searchable `Select` combobox sets the cookie with 24-hour expiry. Mantine `Indicator` with `processing` prop provides the animated red badge on both desktop and mobile sidebars. The Stop Impersonating `MenuItem` appears conditionally in `UserMenuDropdown` when `isImpersonating` prop is true. All cookie reads happen in `useEffect` to avoid SSR hydration mismatches.

---

_Verified: 2026-02-26T23:26:08Z_
_Verifier: Claude (gsd-verifier)_
