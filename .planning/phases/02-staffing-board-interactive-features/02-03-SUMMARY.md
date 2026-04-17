---
phase: 02-staffing-board-interactive-features
plan: 03
subsystem: ui
tags: [dnd-kit, drag-and-drop, staffing, useDroppable, optimistic-updates]

requires:
  - phase: 02-staffing-board-interactive-features
    plan: 01
    provides: Draggable assignment cards with type-tagged data and grip handles

provides:
  - 3-scenario DnD handler (employee-to-project, assignment-to-home, assignment-to-project)
  - Home drop zone with visual feedback in employee list
  - Type-tagged droppable data on project columns
affects: [02-04]

tech-stack:
  added: []
  patterns:
    - Type-tagged drag/drop data for multi-scenario DnD discrimination

key-files:
  created: []
  modified:
    - apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/employee-list/List.tsx
    - apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/hooks/useDnd.ts
    - apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/project-kanban/ProjectKanban.tsx

key-decisions:
  - "Used drag_drop (not dnd) for metadata source field — matches existing Zod enum validation"
  - "Home drop zone uses dashed border indicator that only appears during assignment drags, not employee drags"
  - "Assignment copy to new project preserves original status (not reset to hasNewProposedDispatch)"
  - "Same-column assignment drop is silent no-op (no error notification)"

patterns-established:
  - "Type-tagged droppable data ({ type: 'project' | 'home' }) enables multi-scenario discrimination in single handleDragEnd"
  - "Conditional drop zone visibility based on store state (activeAssignmentId !== null)"

duration: 3m 20s
completed: 2026-02-06
---

# Phase 2 Plan 3: DnD Wiring Summary

**3-scenario drag-and-drop handler with Home drop zone for assignment management**

## Performance

- Duration: 3m 20s
- Tasks: 2/2 completed
- Typecheck: Passed after each task

## Accomplishments

1. **Home Drop Zone** — Employee list panel is now a droppable target (`id: 'home'`). When an assignment card is being dragged, a dashed indicator appears at top of employee list saying "Drop here to remove from project". On hover, it turns red. During employee drags, no visual feedback shown (backward compatible).

2. **3-Scenario DnD Handler** — Complete rewrite of `handleDragEnd` in `useDnd.ts`:
   - **Scenario 1: Employee → Project** — Existing behavior preserved. Creates new assignment with `hasNewProposedDispatch` status.
   - **Scenario 2: Assignment → Home** — Updates assignment status to `goingHome` with `moveOutDate = today`. No confirmation popup.
   - **Scenario 3: Assignment → Different Project** — Creates a true copy (employee stays in both projects). Original status preserved. Same-column drops are silent no-ops.

3. **Type-Tagged Project Droppables** — Project columns now include `{ type: 'project', projectId }` in their droppable data, enabling the handler to discriminate between Home and Project drop targets.

## Task Commits

| Task | Description                                | Commit     | Files                        |
| ---- | ------------------------------------------ | ---------- | ---------------------------- |
| 1    | Home drop zone in employee list            | `25f1366b` | List.tsx                     |
| 2    | 3-scenario DnD handler + project type data | `1cec118c` | useDnd.ts, ProjectKanban.tsx |

## Files Created/Modified

**Modified:**

- `List.tsx` — Added useDroppable, conditional Home drop zone indicator, red ring feedback
- `useDnd.ts` — Rewrote handleDragEnd for 3 scenarios, imported StaffingStatusType and updateAssignment
- `ProjectKanban.tsx` — Added type data to project column droppable

## Decisions Made

| #   | Decision                            | Rationale                                                                               |
| --- | ----------------------------------- | --------------------------------------------------------------------------------------- |
| 1   | Used `drag_drop` source in metadata | Matches existing Zod enum validation (not `dnd`)                                        |
| 2   | Conditional drop zone visibility    | Only show Home indicator during assignment drags to avoid confusion with employee drags |
| 3   | Preserve status on assignment copy  | User specified: "status preserved" when copying to another project                      |
| 4   | Silent no-op for same-column        | User specified: "Drop on same column cancels silently"                                  |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed metadata source enum value**

- **Found during:** Task 2
- **Issue:** Plan specified `source: "dnd"` but the Zod enum only allows `"drag_drop" | "button" | "modal" | "inline_edit" | "menu"`
- **Fix:** Used `"drag_drop"` instead of `"dnd"`
- **Files modified:** useDnd.ts

**2. [Rule 3 - Blocking] Fixed StaffingStatusType cast**

- **Found during:** Task 2
- **Issue:** `active.data.current?.status` returns `any` which TypeScript wouldn't assign to the StaffingStatusType union
- **Fix:** Imported `StaffingStatusType` from `@repo/db/schema` and cast the value properly
- **Files modified:** useDnd.ts

## Issues Encountered

None — clean execution.
