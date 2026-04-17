# Phase 1: Staffing Board - UI Compaction - Context

**Gathered:** 2026-01-26
**Updated:** 2026-01-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Optimize screen real estate on the Staffing Board so users can see more projects and employee assignments without excessive scrolling. This phase focuses on **aggressive spacing reduction** — cutting all gaps, padding, and margins by 50%. Card content and design remain unchanged.

</domain>

<decisions>
## Implementation Decisions

### Spacing Strategy — 50% Reduction
- **Target: 50% reduction on ALL spacing values** (not 25% as previously planned)
- Remove the `min-h-[350px]` constraint on project cards entirely
- Specific reductions (Tailwind values use rem; Mantine `gap` prop uses raw pixels):
  - Main board Stack `gap={8}` → `gap={4}` (Mantine pixel value: 8px → 4px)
  - DM section margin `mb-4` (16px) → `mb-2` (8px)
  - Sticky header margin `mb-4` (16px) → `mb-2` (8px)
  - Project item horizontal spacing `pr-4` (16px) → `pr-2` (8px)
  - Column gap `gap-4` (16px) → `gap-2` (8px)
  - Card top margin `mt-4` (16px) → `mt-2` (8px)
- Apply the same 50% reduction principle to any other spacing gaps found during research

### What NOT to Touch
- Assignment card component internals (content, layout, design)
- Font sizes — no complaints, keep as-is
- Information displayed on cards — keep all current info visible

### Empty Projects
- Use the same compact add button (40px height) that appears in non-empty projects
- No special large placeholder (120px) for empty projects
- Keep drag-over visual feedback same as current (border + background highlight)

### Scrollbar Visibility
- Always visible styled scrollbar track
- Standard size (~12px width), styled to match app theme
- Just thumb + track, no arrow buttons
- Consistent styling for both horizontal (project scroll) and vertical (DM sections) scrollbars

### Add User Button
- 40px height with "Add employee" text + plus icon
- Same appearance whether project is empty or has assignments
- Keep current click behavior (no change)
- Keep current drag-over behavior (no change)

### Claude's Discretion
- Scrollbar color scheme within app theme
- Virtualizer estimateSize adjustment to match new gap values
- Any micro-adjustments needed for visual balance after 50% cuts

</decisions>

<specifics>
## Specific Ideas

- "Bora ser mais agressivo, diminuir em 50%" — user wants aggressive compaction, not conservative
- Where gap was 8, go to 4. Where margin-bottom was 4, go to 2. Apply this principle everywhere.
- Mantine `gap` prop uses raw pixel values (not Tailwind scale) — `gap={4}` = 4px
- Keep cards as-is, this is about the kanban structure and spacing between elements

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-staffing-board-ui-compaction*
*Context gathered: 2026-01-26*
*Context updated: 2026-01-27*
