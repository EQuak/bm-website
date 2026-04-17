# Phase 2: Staffing Board - Interactive Features - Context

**Gathered:** 2026-02-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can manage employee assignments fluidly via drag & drop and track context with persistent notes. Specifically:

- Create, edit, and delete notes (post-its) on projects
- Drag employee assignment to Home column to remove from project
- Drag employee assignment to another project to copy full assignment details
- Drag handles visible on employee cards for discoverability
- All drag operations use optimistic updates, no confirmation popups

</domain>

<decisions>
## Implementation Decisions

### Project Notes (Post-its)

- Notes are **visual post-it cards**, not icons or popovers — small cards directly on the board
- Post-its appear **at the bottom of the project column**, below employee cards, before the action buttons
- Action buttons become **two side-by-side buttons**: "Add employee" and "Add post-it"
- **Multiple post-its** allowed per project
- **Plain text only** — no rich text, no markdown
- Click on post-it opens a **popover/dialog with a textarea** (not a full modal)
- Textarea: **min-rows=3, max-rows=7**, no character limit on text
- On the card: text **truncated at 3 lines** using Tailwind line-clamp
- Delete via **X button on the corner** of the post-it card
- **3 color options**: yellow (default), red, blue — color picker shown as small buttons inside the edit popover
- Both post-it card AND popover background change to the selected color
- Ordering: **by creation date** (newest last), no manual reordering
- Permissions: **any user** with board access can create, edit, and delete

### Drag Feedback & Visual Cues

- **Drag handle** (grip icon): always visible on assignment cards, not hover-only
- Original card during drag: stays in place with **~80% opacity** (slight dimming)
- Drag overlay: **reuse the existing card component** from employee-to-project drag (consistency)
- **Home drop zone**: a collapsed component in the employee sidebar that **expands/appears when drag is active**, indicating "drop here to remove from project"
- **Project drop zones**: same highlight behavior as existing employee-to-project drag
- Drop on **invalid target or same column**: cancels silently, card returns to normal
- **No confirmation toast or animation** on successful drop — optimistic update IS the feedback

### Edge Cases on Drop Actions

- **Duplicate detection**: if employee already in target project, block drop and show error notification (same existing pattern)
- **Move to Home**: moveOutDate automatically set to **today**, no date picker prompt
- **Optimistic update failure** (network error): revert card to original position AND show error notification

### Assignment Copy Details

- Drag to another project = **true copy** (employee stays in BOTH projects with separate assignments)
- **All fields copied** exactly — dates, status, everything. Only project_id changes
- Copied assignments are **completely independent** — no link/reference between them
- **Any assignment** can be dragged regardless of its current status
- **Status preserved** — new assignment keeps the same status as the original

### Claude's Discretion

- Exact post-it card dimensions and border radius (minimal border, differentiate from employee cards)
- Post-it X button behavior (always visible vs on hover)
- Exact animation/transition when Home drop zone appears during drag
- Drop zone visual styling (border, background color)
- Overlay card shadow/elevation during drag

</decisions>

<specifics>
## Specific Ideas

- Post-its should feel like **real physical post-its** — simple, lightweight, just text on a colored background
- The color system (yellow/red/blue) allows informal categorization without adding formal category management
- Home drop zone should be discoverable — not just a subtle border change, but an actual area that appears when dragging starts
- Consistency is key: reuse existing drag overlay card, reuse existing drop zone patterns, reuse existing error notification patterns

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 02-staffing-board-interactive-features_
_Context gathered: 2026-02-06_
