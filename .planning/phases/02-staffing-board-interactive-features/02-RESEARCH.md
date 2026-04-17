# Phase 2: Staffing Board - Interactive Features - Research

**Researched:** 2026-01-27
**Domain:** React drag-and-drop interactions, persistent note-taking UI
**Confidence:** HIGH

## Summary

Phase 2 adds drag-and-drop functionality to the staffing board using dnd-kit (already installed) and implements persistent notes on projects. Research confirms dnd-kit is the current industry standard for React drag-and-drop (2026), replacing the deprecated react-beautiful-dnd. The library provides excellent accessibility, performance, and flexibility for kanban-style boards with multiple containers.

Key findings:
- dnd-kit v6.3.1 is already installed in the project (apps/web/package.json)
- Database schema for notes already exists (staffing_project_notes table)
- Assignment schema supports status changes and exit dates (move_out_date field)
- Optimistic updates via tRPC/React Query follow standard onMutate pattern
- Auto-scrolling, keyboard navigation, and screen reader support are built-in

**Primary recommendation:** Use dnd-kit with closestCenter collision detection for employee assignment dragging, implement optimistic updates via tRPC mutations, and create simple Mantine Textarea-based notes component with database persistence.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @dnd-kit/core | 6.3.1 | Drag and drop foundation | Industry standard as of 2026 after react-beautiful-dnd deprecation |
| @dnd-kit/sortable | 10.0.0 | Sortable list utilities | Official preset for sorting within containers |
| @dnd-kit/utilities | 3.2.2 | Helper functions | CSS transform utilities, array manipulation |
| @tanstack/react-query | 5.50.0 | State management | Powers tRPC client, handles optimistic updates |
| Mantine Textarea | v7 | Note input component | Project standard, built-in autosize support |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tanstack/react-virtual | 3.13.12 | Virtualization | Already used for horizontal project scrolling |
| framer-motion | 12.4.7 | Enhanced animations | Optional drag feedback animations |
| immer | 10.1.1 | Immutable updates | Simplify optimistic update logic |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| dnd-kit | Pragmatic drag-and-drop | Framework-agnostic but more boilerplate for React |
| dnd-kit | react-dnd | Older, larger bundle, more complex API |
| dnd-kit | react-beautiful-dnd | DEPRECATED - Atlassian recommends Pragmatic instead |

**Installation:**
```bash
# Already installed - no additional packages needed
# Verify with:
pnpm list @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Architecture Patterns

### Recommended Project Structure
```
apps/web/src/app/(application)/app/(staffing)/staffing-board/
├── _src/
│   ├── components/
│   │   ├── board/
│   │   │   ├── DndProvider.tsx              # NEW: Wrap board with DndContext
│   │   │   ├── DMLists.tsx                  # EXISTING: Update with droppable
│   │   │   ├── project-kanban/
│   │   │   │   ├── ProjectKanban.tsx        # EXISTING: Make droppable
│   │   │   │   ├── ProjectNotes.tsx         # NEW: Notes CRUD UI
│   │   │   │   ├── assignment-card/
│   │   │   │   │   ├── ProjectAssignmentCard.tsx  # EXISTING: Add drag handle
│   │   │   │   │   └── DragHandle.tsx       # NEW: Visual drag affordance
│   │   └── home-column/
│   │       └── HomeColumn.tsx               # NEW: Special droppable for "remove"
│   └── hooks/
│       ├── useDragEmployee.ts               # NEW: Drag logic + optimistic updates
│       └── useProjectNotes.ts               # NEW: Notes CRUD mutations
```

### Pattern 1: DndContext Setup with Multiple Containers
**What:** Configure DndContext with sensors, collision detection, and event handlers
**When to use:** Root of drag-and-drop feature area
**Example:**
```typescript
// Source: https://docs.dndkit.com/api-documentation/context-provider
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';

export function DndProvider({ children }: { children: React.ReactNode }) {
  // Configure sensors with activation constraints
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts (prevents accidental drags)
      },
    }),
    useSensor(KeyboardSensor) // Accessibility - keyboard navigation
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // Handle drop logic with optimistic updates
    // active.id = employee assignment ID
    // over.id = target project ID or "home"
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter} // Best for kanban boards
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
}
```

### Pattern 2: Droppable Container (Project Column)
**What:** Register project columns as drop targets
**When to use:** Each project kanban column
**Example:**
```typescript
// Source: https://docs.dndkit.com/api-documentation/droppable
import { useDroppable } from '@dnd-kit/core';

export function ProjectKanban({ projectId, children }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: projectId, // Project ID as droppable identifier
    data: { type: 'project', projectId }, // Metadata for drop validation
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'project-column',
        isOver && 'ring-2 ring-blue-500' // Visual feedback when dragging over
      )}
    >
      {children}
    </div>
  );
}
```

### Pattern 3: Draggable Item with Handle
**What:** Make assignment cards draggable with visible handle
**When to use:** Employee assignment cards
**Example:**
```typescript
// Source: https://docs.dndkit.com/api-documentation/draggable
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export function ProjectAssignmentCard({ assignment }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: assignment.id,
    data: { type: 'assignment', assignment }, // Carry full assignment data
  });

  const style = {
    transform: CSS.Translate.toString(transform), // Apply drag transform
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style}>
      {/* Drag handle - isolated touch target */}
      <button
        {...listeners}
        {...attributes}
        className="drag-handle cursor-grab active:cursor-grabbing"
        aria-label="Drag to move employee"
      >
        <GripVertical size={16} />
      </button>

      {/* Card content - NOT draggable */}
      <div>Employee: {assignment.employeeId}</div>
    </Card>
  );
}
```

### Pattern 4: Optimistic Updates with tRPC
**What:** Update UI immediately, rollback on error
**When to use:** All drag-and-drop mutations
**Example:**
```typescript
// Source: https://tanstack.com/query/v4/docs/framework/react/guides/optimistic-updates
const utils = api.useUtils();

const moveEmployeeMutation = api.staffing.moveEmployee.useMutation({
  onMutate: async (newAssignment) => {
    // Cancel outgoing refetches
    await utils.staffing.getAssignments.cancel();

    // Snapshot current data
    const previousData = utils.staffing.getAssignments.getData();

    // Optimistically update UI
    utils.staffing.getAssignments.setData(undefined, (old) => {
      // Use immer or manual array manipulation
      return updateAssignmentsOptimistically(old, newAssignment);
    });

    // Return rollback context
    return { previousData };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    utils.staffing.getAssignments.setData(undefined, context?.previousData);
    notifications.show({ title: 'Error', message: err.message, color: 'red' });
  },
  onSettled: () => {
    // Refetch to sync with server
    utils.staffing.getAssignments.invalidate();
  },
});
```

### Pattern 5: Notes Component with Autosize Textarea
**What:** Simple CRUD interface for project notes
**When to use:** Notes section in project header/footer
**Example:**
```typescript
// Source: https://mantine.dev/core/textarea/
import { Textarea, Button, Stack } from '@mantine/core';
import { useState } from 'react';

export function ProjectNotes({ projectId }: Props) {
  const [notes] = api.staffing.getNotes.useSuspenseQuery({ projectId });
  const [newNote, setNewNote] = useState('');

  const createMutation = api.staffing.createNote.useMutation({
    onSuccess: () => {
      setNewNote('');
      utils.staffing.getNotes.invalidate({ projectId });
    },
  });

  return (
    <Stack>
      {/* Existing notes */}
      {notes.map((note) => (
        <Card key={note.id}>
          <Text size="sm">{note.note}</Text>
          <Text size="xs" c="dimmed">{note.createdAt}</Text>
        </Card>
      ))}

      {/* Add note */}
      <Textarea
        placeholder="Add a note..."
        value={newNote}
        onChange={(e) => setNewNote(e.currentTarget.value)}
        autosize
        minRows={2}
        maxRows={6}
      />
      <Button onClick={() => createMutation.mutate({ projectId, note: newNote })}>
        Add Note
      </Button>
    </Stack>
  );
}
```

### Anti-Patterns to Avoid
- **Rendering same component in DragOverlay and source:** Causes ID collision with useDraggable. Create separate presentational component for overlay.
- **Using rectIntersection for kanban:** Too strict for multi-container boards. Use closestCenter or closestCorners instead.
- **Skipping activation constraints:** Makes accidental drags likely. Always set distance or delay constraint.
- **Forgetting keyboard sensor:** Breaks accessibility. Always include KeyboardSensor in sensors array.
- **Mutating state directly in onMutate:** Breaks React Query optimistic updates. Use setData with immutable updates.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Drag and drop | Custom onMouseDown/onMouseMove | @dnd-kit/core | Handles touch, keyboard, accessibility, collision detection, auto-scroll |
| Optimistic updates | Manual cache mutations | React Query onMutate | Handles cancellation, rollback, refetch orchestration |
| Auto-growing textarea | useEffect + scrollHeight | Mantine Textarea autosize | Handles edge cases, performance optimizations |
| Collision detection | Manual bounding box math | dnd-kit collision algorithms | Optimized, tested, handles edge cases |
| Touch vs mouse detection | Navigator.userAgent checks | PointerSensor | Unified API for all pointing devices |
| Array reordering during drag | Manual splice/slice | @dnd-kit/sortable arrayMove | Handles indices, immutability correctly |

**Key insight:** Drag-and-drop has deep complexity around accessibility (keyboard, screen readers), cross-device input (touch, mouse, pen), and performance (transforms, reflows). dnd-kit solves these with 10KB bundle size.

## Common Pitfalls

### Pitfall 1: DragOverlay Component ID Collision
**What goes wrong:** Rendering the same component that calls useDraggable inside DragOverlay causes unexpected behavior and console errors about duplicate IDs.
**Why it happens:** useDraggable registers a draggable with an ID. If the same component renders both in the source location and the overlay, two draggables have the same ID.
**How to avoid:** Create a presentational version of your component (without useDraggable) for the DragOverlay.
**Warning signs:** Console errors about duplicate draggable IDs, drag operations not working correctly.

**Example:**
```typescript
// WRONG - same component in both places
<DragOverlay>
  <ProjectAssignmentCard assignment={activeAssignment} />
</DragOverlay>

// CORRECT - presentational version for overlay
<DragOverlay>
  <AssignmentCardPreview assignment={activeAssignment} />
</DragOverlay>
```

### Pitfall 2: Virtualization + Drag Scroll Performance
**What goes wrong:** When combining @tanstack/react-virtual with dnd-kit, scrolling during drag can become laggy or jump unexpectedly.
**Why it happens:** Virtual scrolling changes DOM structure while dragging, conflicting with drag position calculations.
**How to avoid:** Use DragOverlay (renders outside virtual container) and ensure drag overlay is position: fixed relative to viewport, not the scrolling container.
**Warning signs:** Lag when dragging near scroll edges, items jumping to wrong positions after drop.

### Pitfall 3: Missing Activation Constraints
**What goes wrong:** Users accidentally trigger drags when trying to click/select text on cards.
**Why it happens:** Default PointerSensor activates immediately on pointer down with no threshold.
**How to avoid:** Always set activationConstraint with distance (8-10px) or delay (200-300ms).
**Warning signs:** Users complaining about accidental drags, difficulty clicking buttons on draggable cards.

### Pitfall 4: Optimistic Update Race Conditions
**What goes wrong:** When dragging multiple items quickly, UI shows stale data after first refetch completes.
**Why it happens:** Second mutation's onMutate runs before first mutation's refetch completes, so second mutation snapshots stale data.
**How to avoid:** Always cancel ongoing queries in onMutate, use onSettled (not onSuccess) for invalidation.
**Warning signs:** Items jumping back to old positions after multiple rapid drags, inconsistent state after batch operations.

### Pitfall 5: Auto-Scroll Configuration
**What goes wrong:** Board doesn't auto-scroll when dragging near edges, or scrolls in wrong direction.
**Why it happens:** Auto-scroll requires correctly identified scrollable ancestors and proper thresholds.
**How to avoid:** Ensure DndContext autoScroll prop is not disabled, verify scrollable container has overflow: auto/scroll and explicit height.
**Warning signs:** No scrolling when dragging to viewport edge, scroll jumping when near edges.

### Pitfall 6: Keyboard Navigation Without Proper Announcements
**What goes wrong:** Screen reader users get no feedback about drag operations.
**Why it happens:** Default aria-live regions don't announce all state changes.
**How to avoid:** Use dnd-kit's announcements prop on DndContext or @dnd-kit/accessibility package for custom screen reader messages.
**Warning signs:** Accessibility audits fail, keyboard users report confusion about drag state.

## Code Examples

Verified patterns from official sources:

### Home Column Droppable (Remove Assignment)
```typescript
// Source: https://docs.dndkit.com/api-documentation/droppable
import { useDroppable } from '@dnd-kit/core';

export function HomeColumn() {
  const { setNodeRef, isOver } = useDroppable({
    id: 'home', // Special ID for "remove from project"
    data: { type: 'home' },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'home-column border-2 border-dashed',
        isOver && 'border-red-500 bg-red-50'
      )}
    >
      <Text>Drag here to remove from project</Text>
    </div>
  );
}
```

### Handle Drag End with Multiple Drop Targets
```typescript
// Source: https://docs.dndkit.com/api-documentation/context-provider
function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;
  if (!over) return;

  const assignmentId = active.id as string;
  const assignment = active.data.current?.assignment;

  // Case 1: Drag to Home (remove from project)
  if (over.id === 'home') {
    removeEmployeeMutation.mutate({
      assignmentId,
      status: 'goingHome',
      moveOutDate: new Date(),
    });
    return;
  }

  // Case 2: Drag to another project (copy assignment)
  const targetProjectId = over.id as string;
  if (targetProjectId !== assignment.projectId) {
    copyEmployeeMutation.mutate({
      ...assignment,
      projectId: targetProjectId,
      id: undefined, // Create new assignment
    });
  }
}
```

### Sensor Configuration for Cards with Interactive Elements
```typescript
// Source: https://docs.dndkit.com/api-documentation/sensors/pointer
import { PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';

const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // Prevent accidental drags when clicking buttons
    },
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates, // For sortable lists
  })
);
```

### Notes CRUD with tRPC
```typescript
// API Router (packages/api/src/router/staffing/staffing-notes.router.ts)
import { createTRPCRouter, protectedProcedure } from '#/trpc';
import { z } from 'zod';
import { StaffingProjectNotesTable, staffingProjectNotesSchema } from '@repo/db/schema';

export const staffingNotesRouter = createTRPCRouter({
  getNotes: protectedProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.StaffingProjectNotesTable.findMany({
        where: eq(StaffingProjectNotesTable.projectId, input.projectId),
        orderBy: desc(StaffingProjectNotesTable.createdAt),
      });
    }),

  createNote: protectedProcedure
    .input(staffingProjectNotesSchema.insert)
    .mutation(async ({ ctx, input }) => {
      const [note] = await ctx.db
        .insert(StaffingProjectNotesTable)
        .values({
          ...input,
          senderId: ctx.user.id, // Auto-populate from auth
        })
        .returning();
      return note;
    }),

  updateNote: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      note: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(StaffingProjectNotesTable)
        .set({ note: input.note })
        .where(eq(StaffingProjectNotesTable.id, input.id))
        .returning();
      return updated;
    }),

  deleteNote: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(StaffingProjectNotesTable)
        .where(eq(StaffingProjectNotesTable.id, input.id));
    }),
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-beautiful-dnd | dnd-kit or Pragmatic drag-and-drop | 2022 (deprecated) | Must migrate for continued support |
| HTML5 Drag API directly | dnd-kit abstraction | 2021+ | Better accessibility, cross-device support |
| Mouse-only drag | PointerSensor (unified input) | 2020+ | Touch devices work out of box |
| Manual optimistic updates | React Query onMutate | 2020+ | Built-in rollback, less error-prone |
| Fixed scroll containers | Auto-scroll aware | 2021+ | dnd-kit handles scrolling automatically |

**Deprecated/outdated:**
- react-beautiful-dnd: Officially deprecated by Atlassian in 2022, recommend Pragmatic drag-and-drop
- react-dnd: Still maintained but older, heavier, more complex than dnd-kit
- MouseSensor + TouchSensor: Use PointerSensor instead for unified API
- Manual collision detection: Use built-in algorithms (closestCenter, rectIntersection)

## Open Questions

Things that couldn't be fully resolved:

1. **Virtualization + Drag Performance**
   - What we know: GitHub issue #1674 reports scroll lag with @tanstack/react-virtual + dnd-kit sortable
   - What's unclear: Whether this affects horizontal virtualization (board uses horizontal), and if DragOverlay fully solves it
   - Recommendation: Test with current board setup, use DragOverlay if issues occur

2. **Multi-Container Copy vs Move Semantics**
   - What we know: Requirement says "drag to another project copies assignment"
   - What's unclear: Should original assignment remain? Does "copy" mean duplicate or move?
   - Recommendation: Implement as true copy (new DB row) per literal requirement, validate with stakeholders

3. **Notes Ordering/Positioning**
   - What we know: Database has createdAt timestamp
   - What's unclear: Should notes have explicit position/order field for manual reordering?
   - Recommendation: Start with timestamp ordering (newest first), add position field if users request reordering

## Sources

### Primary (HIGH confidence)
- dnd-kit Official Docs - https://docs.dndkit.com
- TanStack Query Optimistic Updates - https://tanstack.com/query/v4/docs/framework/react/guides/optimistic-updates
- Mantine Textarea - https://mantine.dev/core/textarea/
- Atlassian Design Guidelines (Pragmatic Drag and Drop) - https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines/

### Secondary (MEDIUM confidence)
- GitHub dnd-kit/dnd-kit Issues and Discussions - verified common pitfalls
- LogRocket: Build a Kanban board with dnd-kit - https://blog.logrocket.com/build-kanban-board-dnd-kit-react/
- Nielsen Norman Group: Drag-and-Drop Design Guidelines - https://www.nngroup.com/articles/drag-drop/

### Tertiary (LOW confidence - flagged for validation)
- WebSearch results about react-virtual + dnd-kit performance - single community report, needs testing
- Medium articles about optimistic updates patterns - general patterns match official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - dnd-kit is current industry standard (2026), already installed, official docs authoritative
- Architecture: HIGH - Patterns verified from official documentation, multiple production examples
- Pitfalls: MEDIUM - DragOverlay pitfall is official docs, virtualization issue from GitHub but not extensively tested
- Notes implementation: HIGH - Database schema exists, Mantine Textarea well-documented, tRPC patterns standard

**Research date:** 2026-01-27
**Valid until:** ~2026-04-27 (90 days - dnd-kit is stable, slow release cycle)
