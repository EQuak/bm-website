# Phase 1 Plan 1: Spacing and Scrollbar Compaction Summary

```yaml
phase: 01
plan: 01
subsystem: staffing-board-ui
tags: [css, spacing, scrollbar, ui-compaction, staffing]
dependency-graph:
  requires: []
  provides: [compact-project-cards, visible-scrollbars, reduced-spacing]
  affects: [01-02, 01-03]
tech-stack:
  added: []
  patterns: [tailwind-spacing-utilities, custom-scrollbar-styling]
key-files:
  created: []
  modified:
    - apps/web/src/styles/globals.css
    - apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/index.tsx
    - apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/DMLists.tsx
    - apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/project-kanban/ProjectKanban.tsx
    - apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/project-kanban/NewEmployeeAssignment.tsx
decisions: []
metrics:
  duration: 2m 13s
  started: 2026-01-27
  completed: 2026-01-27
  tasks: 5
  files: 5
```

**One-liner**: Reduced staffing board spacing by 25% and added always-visible scrollbars for Windows/mouse users

## Performance

- **Duration**: 2 minutes 13 seconds
- **Tasks**: 5/5 completed
- **Files**: 5 modified, 0 created
- **Commits**: 5 task commits + 1 metadata commit

## Accomplishments

Successfully reduced vertical spacing across the staffing board, enabling users to see more projects simultaneously without scrolling. Empty project cards now occupy minimal space (~40px) instead of ~350px, representing an 88% reduction in wasted vertical space. Horizontal scrollbars are now always visible for Windows/mouse users, improving navigation discoverability.

### Specific Changes

1. **Always-visible scrollbars** - Added `.staffing-board-scroll` CSS class with light gray track always visible, darker thumb with hover state, and full dark mode support
2. **Main board spacing** - Reduced Stack gap from 8 to 6 (32px → 24px between header, filters, and DM lists)
3. **DM section spacing** - Reduced section margins from mb-4 to mb-3, applied custom scrollbar class, reduced project spacing from pr-4 to pr-3
4. **Project card compaction** - Removed min-h-[350px] constraint, reduced card top margin from mt-4 to mt-3, reduced column gap from gap-4 to gap-3
5. **Add employee button** - Standardized to consistent 40px height (removed 120px empty state)

## Task Commits

| Task | Type | Hash | Description |
|------|------|------|-------------|
| 1 | style | 71e72ea | Add always-visible scrollbar styles for staffing board |
| 2 | style | 05d7986 | Reduce main board stack gap from 8 to 6 |
| 3 | style | d1ffede | Update DMLists spacing and apply always-visible scrollbar |
| 4 | style | e1a997b | Update ProjectKanban spacing and remove min-height |
| 5 | style | 264d103 | Standardize NewEmployeeAssignment button to 40px |

## Files Created

None - all changes were modifications to existing files.

## Files Modified

### CSS/Styling
- `apps/web/src/styles/globals.css` - Added `.staffing-board-scroll` class with always-visible scrollbar styling and dark mode support

### React Components
- `apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/index.tsx` - Reduced main Stack gap
- `apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/DMLists.tsx` - Applied scrollbar class, reduced margins, updated virtualizer estimates
- `apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/project-kanban/ProjectKanban.tsx` - Removed min-height constraint, reduced spacing
- `apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/project-kanban/NewEmployeeAssignment.tsx` - Standardized button height

## Decisions Made

No architectural decisions required - all changes were straightforward CSS/Tailwind adjustments following the established pattern from research phase.

## Deviations from Plan

None - plan executed exactly as written. All tasks completed as specified with no bugs encountered, no missing critical functionality, and no blocking issues.

## Known Issues

None identified. Typecheck passed successfully.

## Next Phase Readiness

**Phase 1 continuation (Plans 01-02, 01-03)**: Ready to proceed. This plan establishes the spacing and scrollbar foundation. Future plans can build on these compaction improvements.

**Blockers**: None

**Concerns**: None - changes are purely visual/spacing and do not affect functionality

## Notes

- All changes are CSS/Tailwind only - no logic changes
- Empty project cards reduced from ~350px to ~40px (88% reduction)
- Spacing reduced by approximately 25% across board (mb-4/gap-4 → mb-3/gap-3)
- Scrollbars now force-visible (`overflow-x-scroll` instead of `overflow-x-auto`)
- Dark mode scrollbar styling matches existing data table patterns
- Virtualizer estimate updated to match new spacing (350 → 342)
