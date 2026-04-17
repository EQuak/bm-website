---
phase: 02-staffing-board-interactive-features
plan: 01
subsystem: ui
tags: [dnd-kit, drag-and-drop, zustand, staffing, useDraggable, DragOverlay]

# Dependency graph
requires:
  - phase: 01-staffing-board-ui-compaction
    provides: Compacted UI layout with assignment cards in project columns
provides:
  - Draggable assignment cards with always-visible grip handles
  - Dual-type drag overlay (employee vs assignment)
  - Type-tagged drag data for employee and assignment drags
  - Store state for active assignment tracking
affects: [02-02, 02-03, 02-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Type-tagged drag data pattern: data.current.type discriminates employee vs assignment"
    - "Grip-handle-only drag activation: listeners on handle element, not entire card"
    - "Separate overlay component pattern: presentational card avoids duplicate draggable IDs"

key-files:
  created: []
  modified:
    - "apps/web/.../staffing-board/_src/types/staffing.type.ts"
    - "apps/web/.../staffing-board/_src/store/staffingStore.ts"
    - "apps/web/.../assignment-card/ProjectAssignmentCard.tsx"
    - "apps/web/.../employee-list/EmployeeCard.tsx"
    - "apps/web/.../shared/StaffingDragOverlay.tsx"
    - "apps/web/.../hooks/useDnd.ts"

key-decisions:
  - "Grip handle always visible (not hover-only) per CONTEXT.md decision"
  - "Assignment card ID uses 'assignment-' prefix to avoid collision with employee IDs"
  - "Drag listeners only on grip icon to preserve button/popover interactivity"
  - "Assignment drag end just clears state — drop logic deferred to Plan 03"

patterns-established:
  - "Type-tagged drag data: { type: 'employee' | 'assignment', ...metadata }"
  - "Grip-handle-only drag: listeners/attributes on handle, not card root"

# Metrics
duration: 4m 30s
completed: 2026-02-06
---

# Phase 2 Plan 1: Drag Foundation Summary

**Draggable assignment cards with always-visible IconGripVertical handles, type-tagged drag data, and dual-type DragOverlay distinguishing employee vs assignment drags**

## Performance

- **Duration:** 4m 30s
- **Started:** 2026-02-06T15:55:22Z
- **Completed:** 2026-02-06T15:59:52Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Assignment cards now have always-visible drag handles (grip icon) in the colored header
- Dragging an assignment shows a styled overlay with employee name + "Moving assignment" badge
- Employee drags continue to work as before with existing overlay (name + badges)
- Store tracks activeAssignmentId + activeAssignmentData for assignment drag state
- handleDragStart discriminates employee vs assignment via type-tagged data
- Source card shows ~80% opacity during drag, restoring on end/cancel

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend store + make assignment cards draggable** - `795952f4` (feat)
2. **Task 2: Dual-type drag overlay + handleDragStart wiring** - `8ac70a1b` (feat)

**Plan metadata:** (pending)

## Files Created/Modified

- `staffing.type.ts` — Added activeAssignmentId + activeAssignmentData to DnD state type
- `staffingStore.ts` — Added setActiveAssignmentId action, initial state, and selectors
- `ProjectAssignmentCard.tsx` — Added useDraggable with grip handle, transform/opacity styles
- `EmployeeCard.tsx` — Added type data to existing useDraggable call
- `StaffingDragOverlay.tsx` — Dual-type overlay: employee card or assignment card
- `useDnd.ts` — handleDragStart detects drag type, handleDragEnd/Cancel clear both states

## Decisions Made

- Grip handle always visible (not hover-only) — per CONTEXT.md, makes drag discoverable
- Used `assignment-${id}` prefix on draggable ID to avoid collision with employee UUIDs
- Drag listeners attached only to grip icon Box, not the entire Card — preserves popover/button clickability
- Assignment drag end just clears state (no drop logic) — drop handling deferred to Plan 03

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

Pre-existing TypeScript errors exist in `ProjectKanban.tsx`, `form.type.ts`, and `useStaffing.ts` related to a `color` property on staffing project notes. These are NOT caused by this plan's changes and were present before execution. No new errors introduced.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Drag foundation is in place: cards are draggable, overlay works, type discrimination ready
- Ready for 02-02-PLAN.md (post-it notes) and 02-03-PLAN.md (DnD wiring with 3-scenario handler)
- Pre-existing type errors should be tracked but do not block Phase 2 progress

---

_Phase: 02-staffing-board-interactive-features_
_Completed: 2026-02-06_
