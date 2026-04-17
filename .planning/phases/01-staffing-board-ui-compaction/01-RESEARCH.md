# Phase 1: Staffing Board - UI Compaction - Research

**Researched:** 2026-01-26
**Domain:** CSS/Tailwind spacing reduction, custom scrollbar styling
**Confidence:** HIGH

## Summary

Phase 1 focuses on reducing spacing in the Staffing Board to allow users to see more projects and employee assignments without excessive scrolling. This is a CSS/Tailwind implementation with no logic changes or library additions required.

The research identified all hardcoded spacing values in the staffing board components and documented the project's existing scrollbar patterns using the `tailwind-scrollbar` plugin (already installed). All spacing changes will use Tailwind utility classes, and scrollbar styling will follow the established pattern from the data tables.

**Primary recommendation:** Reduce gaps systematically using Tailwind spacing scale (targeting 10-20% reduction), remove/reduce the `min-h-[350px]` constraint on project cards, standardize the "Add employee" button to 40px height, and apply always-visible styled scrollbars using existing patterns.

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.x | Utility-first CSS framework | Project standard for all styling |
| tailwind-scrollbar | 3.1.0 | Custom scrollbar utilities | Already installed, provides cross-browser scrollbar styling |
| Mantine UI | 7.x | Component library | Project UI framework with ScrollArea component |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| CSS Custom Properties | Native | Scrollbar theming | For always-visible scrollbar track/thumb colors |
| @tanstack/react-virtual | Latest | Horizontal virtualization | Already in use for project columns |

**Installation:** No new packages needed. All tools already installed.

## Architecture Patterns

### Current Staffing Board Structure
```
apps/web/src/app/(application)/app/(staffing)/staffing-board/
├── page.tsx                                    # Main page with PanelGroup
├── _src/components/
│   ├── board/
│   │   ├── index.tsx                          # StaffingBoard (Stack with gap={8})
│   │   ├── DMLists.tsx                        # DM sections (Stack gap={0}, mb-4)
│   │   └── project-kanban/
│   │       ├── ProjectKanban.tsx              # Project cards (min-h-[350px], w-[330px])
│   │       ├── NewEmployeeAssignment.tsx      # Add button (minHeight: 120px empty)
│   │       └── assignment-card/
│   │           └── ProjectAssignmentCard.tsx  # Assignment cards
│   └── employee-list/
│       └── List.tsx                           # Employee list with scrollbar-thin
```

### Pattern 1: Hardcoded Spacing Values

**Current spacing values identified:**

**Board Structure (index.tsx):**
```typescript
<Stack flex={1} h={"100%"} w={"100%"} gap={8}>  // 8 = 32px gap
```

**DM Sections (DMLists.tsx):**
```typescript
// Line 100: DM section container
<Stack gap={0} className="mb-4">  // mb-4 = 16px margin-bottom

// Line 104: DM sticky header
className="mb-4"  // 16px between header and projects

// Line 160: Project container
<div className="w-[calc(100%-0.25rem)] px-2 pb-2">  // px-2 = 8px, pb-2 = 8px

// Line 204: Virtualizer estimate
estimateSize: () => 350,  // 330px card + 16px gap (pr-4)

// Line 246: Project item wrapper
className="flex-shrink-0 pr-4"  // pr-4 = 16px gap between projects
```

**Project Cards (ProjectKanban.tsx):**
```typescript
// Line 96-104: Project card
<Card
  className="min-h-[350px] w-fit"  // MAIN CONSTRAINT - 350px minimum height
  className="mt-4"  // 16px top margin
  className="p-2 px-2 pt-4"  // p-2 = 8px all, px-2 = 8px horizontal, pt-4 = 16px top
>

// Line 113-115: Header badge group
<Group gap={0} className="-top-3 absolute">  // Badge group has no gap

// Line 140: Content area with columns
<div className="flex h-full gap-4">  // gap-4 = 16px between columns

// Line 142: Individual column
<div className="w-[330px]">  // Fixed width 330px

// Line 143: Assignment stack
<Stack mt={"0.25rem"}>  // 0.25rem = 4px top margin
```

**Empty State (NewEmployeeAssignment.tsx):**
```typescript
// Line 27: Empty variant minHeight
minHeight: variant === "empty" ? 120 : 40,  // 120px for empty, 40px for last
```

**Assignment Cards (ProjectAssignmentCard.tsx):**
```typescript
// Line 86: Card padding
p={0}  // No padding on card itself

// Line 92: Header padding
p="6px 8px"  // 6px vertical, 8px horizontal

// Line 134-137: Body padding
<Stack gap={4} p="6px 8px">  // gap-4 = 4px, padding 6x8
```

### Pattern 2: Tailwind Spacing Scale

**Values used in codebase (assuming 1rem = 16px):**

| Class | Value | Pixels | Current Usage |
|-------|-------|--------|---------------|
| `gap-0` | 0 | 0px | DM Stack, badge group |
| `p-2` | 0.5rem | 8px | Card padding, project container |
| `gap-4` | 1rem | 16px | Assignment stack, column gaps |
| `pr-4` | 1rem | 16px | Project spacing in virtualizer |
| `mb-4` | 1rem | 16px | DM section spacing |
| `mt-4` | 1rem | 16px | Project card top margin |
| `pt-4` | 1rem | 16px | Project card top padding |
| `gap-8` | 2rem | 32px | Main board Stack |

**Target reduction (10-20%):**
- `gap-8` → `gap-6` (32px → 24px, 25% reduction)
- `mb-4` → `mb-3` (16px → 12px, 25% reduction)
- `gap-4` → `gap-3` (16px → 12px, 25% reduction)
- `pr-4` → `pr-3` (16px → 12px, 25% reduction)
- Keep smaller values (p-2, gap-0) unchanged

### Pattern 3: Scrollbar Styling

**Existing pattern from data tables (globals.css):**
```css
/* Standard scrollbar styling */
.data-table-scroll {
  scrollbar-width: thin;  /* Firefox standard property */
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;  /* thumb track */
}

/* WebKit browsers (Chrome, Safari, Edge) */
.data-table-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.data-table-scroll::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 8px;
}

.data-table-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.data-table-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
```

**Current staffing board usage (tailwind-scrollbar plugin):**
```typescript
// DMLists.tsx line 85 (vertical scroll)
className="scrollbar-thin scrollbar-thumb-mtn-gray-3 scrollbar-track-white"

// DMLists.tsx line 233 (horizontal scroll)
className="scrollbar-thin scrollbar-thumb-mtn-gray-3 scrollbar-track-white"
```

**Always-visible scrollbar pattern:**
```css
/* Force scrollbar visibility (macOS/Windows) */
.always-visible-scrollbar {
  overflow-x: scroll;  /* NOT auto - scroll always shows track */
  scrollbar-width: thin;
  scrollbar-color: rgb(209, 213, 219) rgb(249, 250, 251);  /* thumb track */
}

.always-visible-scrollbar::-webkit-scrollbar {
  width: 12px;
  height: 12px;
  background-color: rgb(249, 250, 251);  /* Track always visible */
}

.always-visible-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgb(209, 213, 219);
  border-radius: 6px;
  border: 2px solid rgb(249, 250, 251);
  background-clip: content-box;
}

.always-visible-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156, 163, 175);
}
```

### Pattern 4: Virtualization Size Adjustment

**Current implementation:**
```typescript
// DMLists.tsx line 204
estimateSize: () => 350,  // 330px card width + 16px gap (pr-4)
```

**After reducing pr-4 to pr-3:**
```typescript
estimateSize: () => 342,  // 330px card width + 12px gap (pr-3)
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Custom scrollbars | CSS from scratch | `tailwind-scrollbar` plugin + globals.css pattern | Already installed, cross-browser tested, matches existing data tables |
| Spacing utilities | Inline styles or custom CSS | Tailwind spacing scale | Consistent, maintainable, theme-aware |
| Always-visible scrollbars | JavaScript solutions | CSS `overflow: scroll` + styled track | Native browser support, no performance overhead |
| Responsive spacing | Media queries in CSS | Tailwind responsive utilities | Built-in, works with existing system |

**Key insight:** The project has established patterns for both scrollbar styling and spacing. No custom solutions needed—apply existing patterns consistently.

## Common Pitfalls

### Pitfall 1: macOS Scrollbar Visibility

**What goes wrong:** Setting `overflow: auto` hides scrollbars on macOS even with custom styling
**Why it happens:** macOS system preference "Show scroll bars" defaults to "When scrolling"
**How to avoid:** Use `overflow: scroll` (not `auto`) to force scrollbar track visibility
**Warning signs:** Scrollbars appear on Windows but not on Mac, or only appear when actively scrolling

### Pitfall 2: Virtualizer Estimate Mismatch

**What goes wrong:** Horizontal scroll jumps or doesn't render all items when estimateSize is wrong
**Why it happens:** @tanstack/react-virtual uses estimateSize for initial layout calculation
**How to avoid:** Update estimateSize to match actual card width + gap after spacing changes
**Warning signs:** Projects cut off at edges, scroll position jumps unexpectedly

### Pitfall 3: Min-Height Removal Breaking Empty State

**What goes wrong:** Empty project cards collapse to 0 height or content height only
**Why it happens:** Removing `min-h-[350px]` without considering empty state layout
**How to avoid:** Keep minHeight on the NewEmployeeAssignment component (already set to 120px for empty, 40px for last)
**Warning signs:** Empty projects become tiny, "Add employee" button hard to see

### Pitfall 4: Inconsistent Gap Reductions

**What goes wrong:** Visual imbalance when some gaps reduced but not others
**Why it happens:** Cherry-picking gaps without considering overall composition
**How to avoid:** Reduce gaps proportionally—if horizontal gaps reduced by X%, reduce vertical gaps by similar %
**Warning signs:** Elements feel cramped in one direction but spacious in another

### Pitfall 5: Scrollbar Plugin vs CSS Conflicts

**What goes wrong:** Scrollbar styling doesn't apply or creates double scrollbars
**Why it happens:** Mixing tailwind-scrollbar utilities with custom CSS ::-webkit-scrollbar rules
**How to avoid:** Choose ONE approach per element: either plugin utilities OR custom CSS class
**Warning signs:** Scrollbars look wrong, multiple scrollbars appear, styling flickers

## Code Examples

Verified patterns from current codebase and official sources:

### Reduce Main Board Gap
```typescript
// Current: apps/web/.../board/index.tsx line 8
<Stack flex={1} h={"100%"} w={"100%"} gap={8}>

// After: Reduce 32px → 24px (25% reduction)
<Stack flex={1} h={"100%"} w={"100%"} gap={6}>
```

### Reduce DM Section Spacing
```typescript
// Current: apps/web/.../board/DMLists.tsx line 100
<Stack gap={0} className="mb-4">

// After: Reduce 16px → 12px (25% reduction)
<Stack gap={0} className="mb-3">
```

### Remove Project Card Min-Height
```typescript
// Current: apps/web/.../project-kanban/ProjectKanban.tsx line 104
className="min-h-[350px] w-fit"

// After: Remove constraint, let content determine height
className="w-fit"
```

### Standardize Empty State Button Height
```typescript
// Current: apps/web/.../NewEmployeeAssignment.tsx line 27
minHeight: variant === "empty" ? 120 : 40,

// After: Use 40px for both variants
minHeight: 40,
```

### Apply Always-Visible Scrollbar (Horizontal)
```typescript
// Current: apps/web/.../DMLists.tsx line 233
className="scrollbar-thin scrollbar-thumb-mtn-gray-3 scrollbar-track-white mb-2 w-full overflow-x-auto"

// After: Add always-visible scrollbar + custom track
// Option 1: Add custom CSS class in globals.css
className="staffing-board-scroll mb-2 w-full overflow-x-scroll"

// Option 2: Extend existing utilities with track visibility
className="scrollbar-thin scrollbar-thumb-mtn-gray-3 scrollbar-track-gray-100 mb-2 w-full overflow-x-scroll"
```

### Always-Visible Scrollbar CSS (Add to globals.css)
```css
/* Staffing board always-visible scrollbars */
.staffing-board-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgb(209, 213, 219) rgb(249, 250, 251);
}

.staffing-board-scroll::-webkit-scrollbar {
  width: 12px;
  height: 12px;
  background-color: rgb(249, 250, 251); /* Always visible track */
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

/* Dark mode */
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

### Reduce Column Gaps
```typescript
// Current: apps/web/.../ProjectKanban.tsx line 140
<div className="flex h-full gap-4">

// After: Reduce 16px → 12px (25% reduction)
<div className="flex h-full gap-3">
```

### Reduce Project Horizontal Spacing
```typescript
// Current: apps/web/.../DMLists.tsx line 246
className="flex-shrink-0 pr-4"

// After: Reduce 16px → 12px (25% reduction)
className="flex-shrink-0 pr-3"

// Also update virtualizer estimate (line 204)
estimateSize: () => 342, // 330px card width + 12px gap
```

### Reduce Card Top Spacing
```typescript
// Current: apps/web/.../ProjectKanban.tsx line 101
className="mt-4 flex flex-col"

// After: Reduce 16px → 12px (25% reduction)
className="mt-3 flex flex-col"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `overflow-scrolling: touch` | Native scroll behavior | iOS 13+ | No longer needed, native smooth scrolling |
| `::-webkit-scrollbar` only | `scrollbar-width` + `scrollbar-color` + `::-webkit-scrollbar` | Chrome 121+ (2024) | Better cross-browser support |
| `overflow: auto` | `overflow: scroll` for always-visible | Ongoing best practice | Forces scrollbar track visibility |
| Fixed px values | Tailwind spacing scale | Project standard | Consistent, maintainable spacing |

**Deprecated/outdated:**
- Using JavaScript to detect scroll and show/hide scrollbars: Use CSS `overflow: scroll` instead
- Custom scrollbar libraries (e.g., simplebar): Native CSS is sufficient for this use case
- Inline styles for spacing: Use Tailwind utilities for consistency

## Open Questions

None. All spacing values have been identified in the current implementation and the approach is clear.

## Sources

### Primary (HIGH confidence)
- Codebase inspection: `apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/`
- Existing patterns: `apps/web/src/styles/globals.css` (data table scrollbars)
- Tailwind config: `apps/web/tailwind.config.ts` (tailwind-scrollbar plugin already installed)
- [Tailwind CSS Spacing Documentation](https://tailwindcss.com/docs/customizing-spacing) - Default spacing scale

### Secondary (MEDIUM confidence)
- [Preline UI Custom Scrollbar](https://preline.co/docs/custom-scrollbar.html) - WebKit scrollbar patterns with Tailwind
- [Chrome for Developers: Scrollbar Styling](https://developer.chrome.com/docs/css-ui/scrollbar-styling) - Modern scrollbar-color/width properties
- [tailwind-scrollbar plugin documentation](https://adoxography.github.io/tailwind-scrollbar/examples) - Plugin usage examples
- [Guide to Custom Scrollbar Styling with Tailwind CSS v4](https://medium.com/@lyecre/guide-to-custom-scrollbar-styling-with-tailwind-css-v4-a7c8fce28e88) - Modern Tailwind patterns

### Tertiary (LOW confidence)
- [GeeksforGeeks: Tailwind CSS Scrollbar Styling](https://www.geeksforgeeks.org/reactjs/how-to-change-style-of-scrollbar-using-tailwind-css/) - General concepts
- [Scott Spence: Scrollbar Styling](https://scottspence.com/posts/scrollbar-styling-with-tailwind-and-daisyui) - Community patterns

## Metadata

**Confidence breakdown:**
- Spacing values: HIGH - All values directly inspected in current codebase
- Scrollbar patterns: HIGH - Existing pattern found in globals.css, tailwind-scrollbar already installed
- Tailwind utilities: HIGH - Standard Tailwind spacing scale, well-documented
- Cross-browser compatibility: MEDIUM - Based on official docs and current web standards (2026)

**Research date:** 2026-01-26
**Valid until:** 60 days (stable domain - CSS patterns don't change rapidly)

---

## Summary of Changes Needed

### Files to Modify

1. **apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/index.tsx**
   - Line 8: `gap={8}` → `gap={6}` (32px → 24px)

2. **apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/DMLists.tsx**
   - Line 100: `mb-4` → `mb-3` (16px → 12px)
   - Line 104: `mb-4` → `mb-3` (16px → 12px)
   - Line 204: `estimateSize: () => 350` → `estimateSize: () => 342`
   - Line 233: Add `overflow-x-scroll` and `staffing-board-scroll` class
   - Line 246: `pr-4` → `pr-3` (16px → 12px)

3. **apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/project-kanban/ProjectKanban.tsx**
   - Line 101: `mt-4` → `mt-3` (16px → 12px)
   - Line 104: Remove `min-h-[350px]`
   - Line 140: `gap-4` → `gap-3` (16px → 12px)

4. **apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/components/board/project-kanban/NewEmployeeAssignment.tsx**
   - Line 27: `variant === "empty" ? 120 : 40` → `40` (standardize to 40px)

5. **apps/web/src/styles/globals.css**
   - Add `.staffing-board-scroll` class with always-visible scrollbar styling

### Expected Impact

- **Vertical space saved:** ~25% reduction in gaps between major sections
- **Project card height:** Dynamic (content-based) instead of minimum 350px
- **Empty projects:** 80px height reduction (120px → 40px button)
- **Scrollbar visibility:** Always visible on Windows/Mac for both horizontal and vertical scrolls
- **Total improvement:** Users should see 1-2 additional projects per screen on typical displays
