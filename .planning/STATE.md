# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-26)

**Core value:** Completely migrate from the legacy PHP system to the new system, maintaining functional parity and allowing users to abandon the old system
**Current focus:** Phase 7 complete — developer profile impersonation shipped and verified. Next: Phase 3 (Welcome Pages) or Phase 4 (Mobile Infrastructure)

## Current Position

Phase: 7 of 7 (Add developer profile impersonation via cookie-based approach) — Complete
Plan: 2 of 2 — all plans complete
Status: Phase complete
Last activity: 2026-02-26 — Completed 07-02-PLAN.md (frontend impersonation UI, verified end-to-end)

Progress: [██████████] 100% (phase 7)

## Performance Metrics

**Velocity:**

- Total plans completed: 7
- Average duration: 4m 2s
- Total execution time: 0.47 hours

**By Phase:**

| Phase | Plans | Total  | Avg/Plan |
| ----- | ----- | ------ | -------- |
| 1     | 1     | 2m 13s | 2m 13s   |
| 2     | 4     | 20m 0s | 5m 0s    |
| 7     | 2     | 5m 29s | 2m 45s   |

**Recent Trend:**

- Plan 01-01: 2m 13s (5 tasks, CSS/spacing only)
- Plan 02-01: 4m 30s (2 tasks, DnD wiring + store changes)
- Plan 02-02: 10m 0s (2 tasks, DB schema + post-it UI)
- Plan 02-03: 3m 20s (2 tasks, DnD handler + Home drop zone)
- Plan 02-04: 2m 10s (verification checkpoint + fixes)
- Plan 07-01: 1m 37s (2 tasks, pure API/logic changes)
- Plan 07-02: ~10min (3 tasks, frontend UI + human verification + post-checkpoint fixes)
- Trend: Faster for pure logic tasks vs DB+UI combo

_Updated after each plan completion_

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Staffing Notes persisted to database (users want history, not temporary post-its)
- Drag-to-home without popup (optimistic updates for fluid UX)
- Mobile just make it work (validate infrastructure before expanding features)
- Grip handle always visible, not hover-only (Phase 2, Plan 1)
- Assignment drag IDs use 'assignment-' prefix to avoid collision with employee UUIDs
- Drag listeners on grip handle only — card buttons/popovers remain clickable
- Post-it color stored as text with Zod validation, not pgEnum (Phase 2, Plan 2)
- PostItCard inline in ProjectKanban.tsx, save on popover close (Phase 2, Plan 2)
- Used drag_drop (not dnd) for metadata source — matches Zod enum (Phase 2, Plan 3)
- Assignment copy preserves original status, not reset (Phase 2, Plan 3)
- Home drop zone only visible during assignment drags, hidden during employee drags (Phase 2, Plan 3)
- Post-it default color: red, with 3 options (yellow, red, blue) — darkened shades (Phase 2, verification)
- Drag-to-home sets moveOutConfirmed status + moveOutConfirmedAt + moveOutDate = today (Phase 2, verification)
- Staffing notes read-only view added to project information tab (Phase 2, bonus)
- Parse impersonation cookie from ctx.headers.get('cookie') not next/headers cookies() — unreliable in tRPC context (Phase 7, Plan 1)
- Cookie format realUserId:impersonatedProfileId — validates realUserId === ctx.user.id to prevent cross-user impersonation (Phase 7, Plan 1)
- getRealProfile bypasses cookie entirely — Dev Tools UI needs real user ID to construct cookie (Phase 7, Plan 1)
- Read cookie in useEffect (not during render) to avoid hydration mismatch — cookie is client-only (Phase 7, Plan 2)
- isImpersonating passed as prop from FooterUserButton to UserMenuDropdown — avoids double cookie read (Phase 7, Plan 2)
- Developer Tools nav link uses empty permissions array — page itself handles role gate via redirect() (Phase 7, Plan 2)
- window.location.reload() for profile/role swaps — router.refresh() preserves React state causing hook mismatches when role changes (Phase 7, Plan 2)

### Pending Todos

None.

### Roadmap Evolution

- Phase 7 added: Add developer profile impersonation via cookie-based approach

### Blockers/Concerns

- drizzle-kit push has interactive prompt about `profiles_with_acl_roles` view — may need resolution for future schema changes

## Session Continuity

Last session: 2026-02-26
Stopped at: Completed 07-02-PLAN.md — phase 7 fully complete, human verified
Resume file: None
