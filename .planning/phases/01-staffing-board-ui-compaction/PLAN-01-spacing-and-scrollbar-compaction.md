# PLAN-01: Staffing Board UI Compaction - Spacing and Scrollbar Changes

```yaml
wave: 1
depends_on: []
files_modified:
  - apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/index.tsx
  - apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/DMLists.tsx
  - apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/project-kanban/ProjectKanban.tsx
  - apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/project-kanban/NewEmployeeAssignment.tsx
  - apps/web/src/styles/globals.css
autonomous: true
estimated_time: 15 minutes
```

## Goal

Reduce spacing in the Staffing Board so users can see more projects and employee assignments without excessive scrolling. Apply always-visible scrollbars for Windows/mouse users.

## must_haves

These criteria are derived directly from the phase success criteria and must ALL be true upon completion:

- [ ] Empty project cards occupy minimal vertical space (40px add button, no 350px min-height constraint)
- [ ] Add user button remains compact (40px) even when projects have no users
- [ ] Multiple projects visible simultaneously on typical screens without scrolling (reduced gaps by ~25%)
- [ ] Windows/mouse users can easily see and use horizontal scrollbar (always-visible styled scrollbar)

## Context

This plan implements Phase 1 (Staffing Board - UI Compaction) addressing requirements:
- STAFF-01: Empty project cards occupy minimum space (not ~300px)
- STAFF-02: "Add user" button maintains compact size even when project has no users
- STAFF-03: Better overall space utilization on the whiteboard
- STAFF-08: Horizontal scrollbar visible and accessible for Windows/mouse users

## Pre-flight Checks

<pre_flight_checks>
1. Verify development server runs: `pnpm dev` from project root
2. Navigate to staffing board in browser to see current state
3. Confirm all 5 target files exist and match expected line numbers from research
</pre_flight_checks>

## Tasks

<task id="1">
<title>Add always-visible scrollbar CSS class to globals.css</title>
<file>apps/web/src/styles/globals.css</file>
<instructions>
Add the `.staffing-board-scroll` CSS class with always-visible scrollbar styling at the end of the file, before any closing tags. This class provides:
- Standard 12px scrollbar width/height
- Light gray track that is always visible (not just when scrolling)
- Darker thumb with hover state
- Full dark mode support matching the existing data table patterns

Add this CSS block at the end of the file (after the dark mode skeleton override):

```css
/* Staffing board always-visible scrollbars */
.staffing-board-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgb(209, 213, 219) rgb(249, 250, 251);
}

.staffing-board-scroll::-webkit-scrollbar {
  width: 12px;
  height: 12px;
  background-color: rgb(249, 250, 251);
}

.staffing-board-scroll::-webkit-scrollbar-track {
  background: rgb(249, 250, 251);
  border-radius: 6px;
}

.staffing-board-scroll::-webkit-scrollbar-thumb {
  background-color: rgb(209, 213, 219);
  border-radius: 6px;
  border: 2px solid rgb(249, 250, 251);
  background-clip: content-box;
}

.staffing-board-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156, 163, 175);
}

.staffing-board-scroll::-webkit-scrollbar-corner {
  background: rgb(249, 250, 251);
}

/* Dark mode staffing scrollbar */
:root[data-mantine-color-scheme="dark"] .staffing-board-scroll {
  scrollbar-color: rgba(255, 255, 255, 0.3) rgba(0, 0, 0, 0.2);
}

:root[data-mantine-color-scheme="dark"] .staffing-board-scroll::-webkit-scrollbar {
  background-color: rgba(0, 0, 0, 0.2);
}

:root[data-mantine-color-scheme="dark"] .staffing-board-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

:root[data-mantine-color-scheme="dark"] .staffing-board-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(0, 0, 0, 0.2);
}

:root[data-mantine-color-scheme="dark"] .staffing-board-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

:root[data-mantine-color-scheme="dark"] .staffing-board-scroll::-webkit-scrollbar-corner {
  background: rgba(0, 0, 0, 0.2);
}
```
</instructions>
</task>

<task id="2">
<title>Reduce main board Stack gap</title>
<file>apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/index.tsx</file>
<instructions>
On line 8, change the Stack gap from 8 to 6 (reduces 32px gap to 24px between header, filters, and DM lists).

Change:
```typescript
<Stack flex={1} h={"100%"} w={"100%"} gap={8}>
```

To:
```typescript
<Stack flex={1} h={"100%"} w={"100%"} gap={6}>
```
</instructions>
</task>

<task id="3">
<title>Update DMLists.tsx spacing and scrollbar</title>
<file>apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/DMLists.tsx</file>
<instructions>
Make the following changes to reduce spacing and apply always-visible scrollbar:

**Change 1 - Line 100:** Change DM section margin from mb-4 to mb-3
```typescript
// Current
<Stack gap={0} className="mb-4">
// Change to
<Stack gap={0} className="mb-3">
```

**Change 2 - Line 104:** Change sticky header margin from mb-4 to mb-3
```typescript
// Current
className="sticky top-0 z-10 mb-4 flex h-8 flex-row..."
// Change to
className="sticky top-0 z-10 mb-3 flex h-8 flex-row..."
```

**Change 3 - Line 204:** Update virtualizer estimateSize from 350 to 342 (accounts for reduced gap)
```typescript
// Current
estimateSize: () => 350, // 310 card width + 16px gap
// Change to
estimateSize: () => 342, // 330 card width + 12px gap (pr-3)
```

**Change 4 - Line 233:** Replace scrollbar utilities with custom class and force scroll visibility
```typescript
// Current
className="scrollbar-thin scrollbar-thumb-mtn-gray-3 scrollbar-track-white mb-2 w-full overflow-x-auto overflow-y-hidden"
// Change to
className="staffing-board-scroll mb-2 w-full overflow-x-scroll overflow-y-hidden"
```
Note: Changed `overflow-x-auto` to `overflow-x-scroll` to force scrollbar visibility.

**Change 5 - Line 246:** Reduce project item spacing from pr-4 to pr-3
```typescript
// Current
className="flex-shrink-0 pr-4"
// Change to
className="flex-shrink-0 pr-3"
```
</instructions>
</task>

<task id="4">
<title>Update ProjectKanban.tsx spacing and remove min-height</title>
<file>apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/project-kanban/ProjectKanban.tsx</file>
<instructions>
Make the following changes to reduce spacing and remove minimum height constraint:

**Change 1 - Line 101:** Change card top margin from mt-4 to mt-3
```typescript
// Current
className="relative mt-4 flex flex-col overflow-visible..."
// Change to
className="relative mt-3 flex flex-col overflow-visible..."
```

**Change 2 - Line 104:** Remove `min-h-[350px]` from the className
```typescript
// Current
"min-h-[350px] w-fit"
// Change to
"w-fit"
```

**Change 3 - Line 140:** Change column gap from gap-4 to gap-3
```typescript
// Current
<div className="flex h-full gap-4">
// Change to
<div className="flex h-full gap-3">
```
</instructions>
</task>

<task id="5">
<title>Standardize NewEmployeeAssignment button height</title>
<file>apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/project-kanban/NewEmployeeAssignment.tsx</file>
<instructions>
On line 27, standardize the button height to 40px for both empty and non-empty states.

Change:
```typescript
minHeight: variant === "empty" ? 120 : 40,
```

To:
```typescript
minHeight: 40,
```

This removes the tall 120px placeholder for empty projects, making them much more compact.
</instructions>
</task>

## Verification

<verification>
After completing all tasks, verify the changes work correctly:

1. **Build check**: Run `pnpm build` from project root - should complete without errors

2. **Visual verification in browser**:
   - Start dev server: `pnpm dev`
   - Navigate to the staffing board page
   - Check that:
     - Empty project cards are much smaller (~40px button height instead of ~350px card)
     - Gaps between sections are visibly reduced
     - Horizontal scrollbar is always visible (not just when hovering/scrolling)
     - Dark mode scrollbar colors are correct (toggle theme to verify)
     - All projects still render correctly with assignments
     - Drag-and-drop functionality still works

3. **Specific checks**:
   - Find a project with no assignments - verify it shows compact 40px "Add employee" button
   - Find a project with assignments - verify the "Add employee" button at bottom is also 40px
   - Scroll horizontally on a DM section - scrollbar track should be visible even before scrolling
   - Count visible projects without scrolling - should see more than before

4. **Type check**: Run `pnpm typecheck` - should pass
</verification>

## Rollback

If issues are found, revert changes in this order:
1. Restore original spacing values if layout breaks
2. Remove `.staffing-board-scroll` CSS if scrollbar styling causes issues
3. Restore `min-h-[350px]` if empty cards cause layout problems
4. Restore 120px empty state if UX feedback requires it

All changes are CSS/Tailwind only - no logic changes - so rollback is straightforward.
