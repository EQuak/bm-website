---
phase: 02-staffing-board-interactive-features
plan: 02
subsystem: ui
tags: [mantine, popover, tailwind, line-clamp, post-it, drizzle, trpc]

# Dependency graph
requires:
  - phase: 01-staffing-board-ui-compaction
    provides: Compacted project column layout with assignment cards
provides:
  - Post-it note CRUD on project columns with color selection
  - Dual action buttons (Add employee + Add post-it) per project column
  - Color column on staffing_project_notes table
affects: [03-staffing-drag-drop-enhancements]

# Tech tracking
tech-stack:
  added: []
  patterns:
    [
      "Inline PostItCard component with Popover editor",
      "Optimistic color updates via useStaffing",
    ]

key-files:
  created: []
  modified:
    - packages/db/src/schema/staffing/staffing-project-notes.table.ts
    - packages/api/src/funcs/staffing/staffing-refactor.funcs.ts
    - packages/api/src/router/staffing/staffing.router.ts
    - apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/hooks/useStaffing.ts
    - apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/project-kanban/ProjectKanban.tsx
    - apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/project-kanban/NewEmployeeAssignment.tsx
    - apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/project-kanban/staffing-project-notes/form.type.ts

key-decisions:
  - "Post-it cards inline in ProjectKanban.tsx, not separate file — keeps co-located with column rendering"
  - "Save on popover close for frictionless editing — plus explicit Save button as fallback"
  - "Color column added as text with default, not pgEnum — simpler for 3 values"
  - "Used direct SQL ALTER TABLE instead of drizzle-kit push due to interactive prompt conflict"

patterns-established:
  - "PostItCard: Mantine Popover with Textarea + color picker for inline editing"
  - "Dual action buttons pattern in NewEmployeeAssignment for extensibility"

# Metrics
duration: 10min
completed: 2026-02-06
---

# Phase 2 Plan 2: Post-it Notes Feature Summary

**Post-it note cards with 3-color system (yellow/red/blue) on project columns, featuring popover editing with textarea and color picker**

## Performance

- **Duration:** 10 min
- **Started:** 2026-02-06T15:56:38Z
- **Completed:** 2026-02-06T16:06:38Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Added `color` column to `staffing_project_notes` table with "yellow" default
- Built PostItCard component with colored backgrounds, 3-line text truncation, and X delete button
- Implemented Popover editor with Textarea (minRows=3, maxRows=7) and 3-color circle picker
- Updated NewEmployeeAssignment to dual side-by-side buttons: "Add employee" + "Add post-it"
- Full CRUD with optimistic updates for create, update (text + color), and delete
- Notes persist to database and survive page refresh

## Task Commits

Each task was committed atomically:

1. **Task 1: Add color column to DB table + update API functions and schemas** - `8f6f9a10` (feat)
2. **Task 2: Build post-it note UI cards + popover editor + integrate into project columns** - `f51f7f39` (feat)

**Plan metadata:** (pending docs commit)

## Files Created/Modified

- `packages/db/src/schema/staffing/staffing-project-notes.table.ts` - Added color column (text, default "yellow", notNull)
- `packages/api/src/funcs/staffing/staffing-refactor.funcs.ts` - Updated CRUD funcs to handle color, added color to query columns
- `packages/api/src/router/staffing/staffing.router.ts` - Updated updateStaffingProjectNote input to accept optional color
- `apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/hooks/useStaffing.ts` - Fixed optimistic updates with color field
- `apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/project-kanban/ProjectKanban.tsx` - Added PostItCard component and post-it section in columns
- `apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/project-kanban/NewEmployeeAssignment.tsx` - Dual buttons layout
- `apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/project-kanban/staffing-project-notes/form.type.ts` - Added color to initial values

## Decisions Made

- Post-it cards rendered inline in ProjectKanban.tsx (not a separate file) to keep co-located with column rendering logic
- Save triggers on popover close (onChange handler) for frictionless editing, plus explicit Save button as fallback
- Color stored as text column with default, not pgEnum — simpler for only 3 values with Zod enum validation
- Used direct SQL ALTER TABLE for database migration because drizzle-kit push had interactive prompt conflicts (view rename question)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Used direct SQL instead of drizzle-kit push for color column**

- **Found during:** Task 1 (DB schema push)
- **Issue:** `pnpm db:push` prompted interactively about an unrelated view rename (`profiles_with_acl_roles`), blocking CI-style execution
- **Fix:** Ran direct SQL `ALTER TABLE staffing_project_notes ADD COLUMN IF NOT EXISTS color text NOT NULL DEFAULT 'yellow'` via a temporary Node.js script
- **Files modified:** None (temporary script deleted)
- **Verification:** Column verified via information_schema query
- **Committed in:** 8f6f9a10 (part of Task 1 commit)

**2. [Rule 3 - Blocking] Fixed form.type.ts missing color in initial values**

- **Found during:** Task 1 (TypeScript type checking)
- **Issue:** `form.type.ts` had `noteFormInitialValues` without `color` field, causing satisfies error after column was added to schema
- **Fix:** Added `color: "yellow"` to the initial values object
- **Files modified:** `staffing-project-notes/form.type.ts`
- **Verification:** TypeScript passes
- **Committed in:** 8f6f9a10 (part of Task 1 commit)

---

**Total deviations:** 2 auto-fixed (both blocking)
**Impact on plan:** Blocking fixes necessary for compilation and DB migration. No scope creep.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Post-it notes feature complete, ready for visual verification
- Ready for 02-03-PLAN.md (next plan in phase)
- Post-it data flows through existing tRPC queries so it integrates with board refresh

---

_Phase: 02-staffing-board-interactive-features_
_Completed: 2026-02-06_
