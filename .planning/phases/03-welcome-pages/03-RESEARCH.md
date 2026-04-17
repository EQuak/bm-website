# Phase 3: Welcome Pages - Research

**Researched:** 2026-01-27
**Domain:** Personalized dashboard with role-based widgets, Next.js 15 App Router
**Confidence:** HIGH

## Summary

Research focused on implementing personalized welcome pages with dashboard widgets using Next.js 15, React 19, and the existing TrueUp tech stack. The standard approach combines role-based personalization with modular widget architecture, leveraging React Server Components for initial rendering and client components for interactivity.

**Key findings:**
- Widget systems work best with composition pattern (not drag-and-drop for MVP)
- React Server Components should prefetch widget data in parallel on server
- Role-based UI uses profile.aclRole to conditionally render widget sets
- Real-time updates via Supabase Realtime with query invalidation (established pattern in codebase)
- Performance critical: separate Suspense boundaries per widget, lazy loading

**Primary recommendation:** Build static widget layouts (no customization for MVP) with role-based widget selection, using RSC for data prefetching and granular Suspense boundaries for independent widget loading. Leverage existing Supabase Realtime patterns from staffing module for live updates.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15 | App Router, RSC | Already in use, excellent dashboard performance with RSC |
| React | 19 | UI rendering | Latest with enhanced Suspense for dashboards |
| Mantine UI | v7 | Component library | Project standard, comprehensive dashboard components |
| tRPC | 11 | API layer | Type-safe API, integrates with React Query for widget data |
| React Query | (via tRPC) | Server state | Automatic caching, parallel queries via useQueries |
| Supabase Realtime | Current | Live updates | Already implemented in staffing module |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| React Grid Layout | Latest | Draggable widgets | ONLY if user customization needed (not MVP) |
| nuqs | Current | URL state for filters | Already in project, dashboard filters |
| Recharts/Tremor | Latest | Data visualization | If widgets need charts (recommended) |
| React Suspense | Built-in | Loading boundaries | Per-widget loading states |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Static layouts | React Grid Layout | Adds complexity, unnecessary for role-based views |
| tRPC useQueries | Individual useQuery calls | Waterfalls instead of parallel, slower |
| Supabase Realtime | Polling | More server load, not real-time |

**Installation:**
```bash
# For charts (if needed)
pnpm add recharts @tremor/react

# No additional installs needed for basic dashboard
# (Next.js, React, Mantine, tRPC, Supabase already in project)
```

## Architecture Patterns

### Recommended Project Structure
```
app/(application)/app/
├── page.tsx                    # Welcome page (Server Component)
├── _components/
│   ├── WelcomeDashboard.tsx    # Client component wrapper
│   ├── widgets/
│   │   ├── index.ts            # Widget registry
│   │   ├── RecentTickets.tsx   # Individual widgets
│   │   ├── PendingActions.tsx
│   │   ├── StaffingUpdates.tsx
│   │   ├── InventoryAlerts.tsx
│   │   └── UserStats.tsx
│   └── role-configs/
│       ├── index.ts            # Role-to-widget mapping
│       ├── admin-layout.ts     # Admin widget config
│       ├── manager-layout.ts   # Manager widget config
│       └── employee-layout.ts  # Employee widget config
```

### Pattern 1: Server Component with Parallel Prefetch
**What:** Root page prefetches all widget data in parallel before hydration
**When to use:** Initial page load for dashboard
**Example:**
```typescript
// Source: Next.js 15 App Router patterns + tRPC docs
// app/page.tsx (Server Component)
import { api, HydrateClient } from "#/trpc/server";
import { WelcomeDashboard } from "./_components/WelcomeDashboard";

export default async function HomePage() {
  // Get user profile to determine role
  const profile = await api.profiles.getProfileByUserLogged();

  // Prefetch widget data in parallel based on role
  const prefetchPromises = [];

  if (profile.aclRole === 'admin' || profile.aclRole === 'manager') {
    prefetchPromises.push(
      api.tickets.getRecentTickets.prefetch({ limit: 5 }),
      api.staffing.getPendingActions.prefetch(),
    );
  }

  if (profile.aclRole === 'employee') {
    prefetchPromises.push(
      api.tickets.getMyTickets.prefetch({ limit: 5 }),
      api.staffing.getMyAssignments.prefetch(),
    );
  }

  // Wait for all prefetches
  await Promise.all(prefetchPromises);

  return (
    <HydrateClient>
      <WelcomeDashboard />
    </HydrateClient>
  );
}
```

### Pattern 2: Widget Composition with Role-Based Registry
**What:** Map roles to widget configurations, render conditionally
**When to use:** Determining which widgets to show per user
**Example:**
```typescript
// Source: Common RBAC patterns + codebase profile structure
// _components/role-configs/index.ts
import { RecentTickets, PendingActions, MyAssignments } from "../widgets";

export const ROLE_WIDGET_CONFIGS = {
  admin: {
    widgets: [
      { component: RecentTickets, span: 6 },
      { component: PendingActions, span: 6 },
      { component: StaffingUpdates, span: 12 },
    ],
    title: "Admin Dashboard"
  },
  manager: {
    widgets: [
      { component: PendingActions, span: 6 },
      { component: MyTeamStatus, span: 6 },
      { component: RecentTickets, span: 12 },
    ],
    title: "Manager Dashboard"
  },
  employee: {
    widgets: [
      { component: MyAssignments, span: 12 },
      { component: MyTickets, span: 12 },
    ],
    title: "My Dashboard"
  }
} as const;

// Usage in WelcomeDashboard.tsx
const config = ROLE_WIDGET_CONFIGS[profile.aclRole] || ROLE_WIDGET_CONFIGS.employee;
```

### Pattern 3: Widget Component with Suspense Boundary
**What:** Each widget has own Suspense boundary for independent loading
**When to use:** Every dashboard widget component
**Example:**
```typescript
// Source: React 19 Suspense docs + Next.js dashboard patterns
// _components/widgets/RecentTickets.tsx
"use client";

import { Suspense } from "react";
import { Card, Skeleton } from "@repo/mantine-ui";
import { api } from "#/trpc/react";

function RecentTicketsContent() {
  const [tickets] = api.tickets.getRecentTickets.useSuspenseQuery({ limit: 5 });

  return (
    <Card>
      <Card.Section>
        <Title order={4}>Recent Tickets</Title>
      </Card.Section>
      {tickets.map(ticket => (
        <TicketRow key={ticket.id} ticket={ticket} />
      ))}
    </Card>
  );
}

export function RecentTickets() {
  return (
    <Suspense fallback={<Skeleton height={200} />}>
      <RecentTicketsContent />
    </Suspense>
  );
}
```

### Pattern 4: Real-Time Widget Updates
**What:** Subscribe to Supabase changes, invalidate specific widget queries
**When to use:** Widgets displaying frequently-changing data
**Example:**
```typescript
// Source: apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/context/realtime-context.tsx
// _components/WelcomeDashboard.tsx
"use client";

import { useEffect } from "react";
import { api } from "#/trpc/react";
import { supabaseBrowserClient as supabase } from "#/utils/supabase/client";

export function WelcomeDashboard() {
  const utils = api.useUtils();

  useEffect(() => {
    const setupRealtime = async () => {
      await supabase.realtime.setAuth();

      const channel = supabase
        .channel("dashboard_updates")
        .on("postgres_changes",
          { event: "*", schema: "public", table: "tks_tickets" },
          (payload) => {
            // Invalidate only tickets widget query
            utils.tickets.getRecentTickets.invalidate();
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    };

    const cleanupPromise = setupRealtime();
    return () => {
      cleanupPromise.then((cleanup) => cleanup());
    };
  }, [utils]);

  // Render widgets...
}
```

### Pattern 5: Parallel Widget Data Fetching
**What:** Use tRPC useQueries to fetch multiple widget datasets in parallel
**When to use:** Client-side widget updates or when prefetch not possible
**Example:**
```typescript
// Source: tRPC v11 docs - useQueries for parallel fetching
// _components/WelcomeDashboard.tsx
"use client";

import { api } from "#/trpc/react";

export function WelcomeDashboard() {
  const results = api.useQueries((t) => [
    t.tickets.getRecentTickets({ limit: 5 }),
    t.staffing.getPendingActions(),
    t.inventory.getLowStockItems({ threshold: 10 }),
  ]);

  const [ticketsQuery, actionsQuery, inventoryQuery] = results;

  // All queries fire in parallel, batched into single HTTP request
  // Each has independent loading/error states
}
```

### Anti-Patterns to Avoid
- **Loading all data client-side**: Use RSC prefetch on server for initial load
- **Single Suspense for entire dashboard**: Independent widget boundaries perform better
- **Polling for updates**: Use Supabase Realtime with query invalidation
- **Widget prop drilling**: Use composition, each widget fetches own data
- **Hardcoded widget layouts**: Use role-based config registry for flexibility

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dashboard grid layout | Custom CSS Grid with media queries | Mantine Grid or SimpleGrid | Responsive, consistent spacing, theme-aware |
| Widget loading skeletons | Custom loading states per widget | Mantine Skeleton | Matches design system, accessible |
| Real-time subscriptions | Custom WebSocket client | Supabase Realtime | Already setup, handles auth, reconnection, RLS |
| Parallel data fetching | Promise.all with fetch | tRPC useQueries | Type-safe, automatic batching, caching |
| Role-based rendering | Inline if statements everywhere | Config-driven registry | Maintainable, testable, scales |
| Date formatting | Custom formatters | Existing project utilities | Consistency, handles timezones |
| Empty states | DIY empty messages | Mantine Empty component | Design consistency |

**Key insight:** Dashboard infrastructure (grid, loading, real-time) is commodity. Differentiation comes from **what** widgets show, not **how** they're plumbed. Use existing patterns from staffing module (Supabase Realtime) and inventory dashboard (widget structure).

## Common Pitfalls

### Pitfall 1: Widget Data Waterfalls
**What goes wrong:** Sequential useQuery calls cause widgets to load one-by-one, each waiting for previous
**Why it happens:** Multiple `const [data] = api.widget.getData.useSuspenseQuery()` in same component
**How to avoid:**
- Server-side: Use `Promise.all()` with multiple `api.*.prefetch()` calls
- Client-side: Use `api.useQueries()` for parallel fetching
**Warning signs:** Dashboard feels sluggish, network tab shows sequential requests

### Pitfall 2: Over-Eager Real-Time Updates
**What goes wrong:** Every database change triggers full dashboard re-render, UI becomes jittery
**Why it happens:** Invalidating too broadly (e.g., invalidating all queries on any change)
**How to avoid:**
- Invalidate only specific widget queries that changed
- Use query keys that match widget scope
- Consider debouncing invalidations (100-500ms)
**Warning signs:** Console logs show constant refetches, animations stutter

### Pitfall 3: Too Many Widgets at Once
**What goes wrong:** Dashboard feels overwhelming, users don't know where to look
**Why it happens:** Trying to show everything, "more is better" mentality
**How to avoid:**
- Limit to 4-6 widgets per role on initial view
- Use "Most Important" principle - what does user need RIGHT NOW?
- Consider progressive disclosure (show more on scroll/interaction)
**Warning signs:** Users ask "where do I find X?", bounce rate high

### Pitfall 4: Stale Profile Data After Role Changes
**What goes wrong:** User's role changes but dashboard doesn't update, shows wrong widgets
**Why it happens:** Profile cached in React Query, not invalidated on role update
**How to avoid:**
- Invalidate profile query after any profile mutation
- Consider profile query refetchOnWindowFocus
- Session-level cache invalidation on profile updates
**Warning signs:** Reports of "wrong dashboard", requiring manual refresh

### Pitfall 5: Missing Loading States
**What goes wrong:** Blank screen while widgets load, users think page is broken
**Why it happens:** Forgetting Suspense boundaries or fallbacks
**How to avoid:**
- Every useSuspenseQuery must have ancestor Suspense with fallback
- Use Skeleton that matches widget dimensions
- Show at least something (header, title) immediately
**Warning signs:** User complaints about "blank page", confusion during load

### Pitfall 6: Non-Responsive Widget Layouts
**What goes wrong:** Dashboard looks good on desktop, broken on mobile/tablet
**Why it happens:** Fixed grid columns, hardcoded widths
**How to avoid:**
- Use Mantine Grid with span={{ base: 12, md: 6 }} responsive props
- Test on mobile early and often
- Consider vertical stacking on mobile
**Warning signs:** Mobile users can't see widgets, horizontal scrolling

### Pitfall 7: Performance Degradation with Many Widgets
**What goes wrong:** Page becomes slow as more widgets added
**Why it happens:** All widgets render at once, heavy queries, no optimization
**How to avoid:**
- Lazy load below-the-fold widgets with React.lazy()
- Use separate Suspense boundaries (parallel vs sequential loading)
- Consider virtual scrolling if >10 widgets
- Memoize widget components
**Warning signs:** Time to Interactive >3s, frame drops while scrolling

## Code Examples

Verified patterns from official sources and existing codebase:

### Example 1: Server Component Page with Role-Based Prefetch
```typescript
// Source: Next.js 15 App Router docs + TrueUp patterns
// app/page.tsx
import { redirect } from "next/navigation";
import { api, HydrateClient } from "#/trpc/server";
import { WelcomeDashboard } from "./_components/WelcomeDashboard";

export default async function HomePage() {
  // Get current user profile (includes aclRole)
  const profile = await api.profiles.getProfileByUserLogged();

  if (!profile) {
    redirect("/auth/login");
  }

  // Define prefetch logic based on role
  const prefetchForRole = async (role: string) => {
    const promises: Promise<any>[] = [];

    // Common widgets for all roles
    promises.push(
      api.profiles.getProfileByUserLogged.prefetch()
    );

    // Role-specific widgets
    if (role === "admin" || role === "manager") {
      promises.push(
        api.tickets.getRecentTickets.prefetch({ limit: 10 }),
        api.staffing.getPendingActions.prefetch(),
        api.projects.getActiveProjects.prefetch({ limit: 5 })
      );
    }

    if (role === "employee") {
      promises.push(
        api.tickets.getMyTickets.prefetch({ limit: 5 }),
        api.staffing.getMyCurrentAssignment.prefetch()
      );
    }

    return Promise.all(promises);
  };

  // Prefetch all widget data in parallel
  await prefetchForRole(profile.aclRole);

  return (
    <HydrateClient>
      <WelcomeDashboard />
    </HydrateClient>
  );
}
```

### Example 2: Widget with Independent Suspense Boundary
```typescript
// Source: React 19 Suspense docs + Mantine patterns
// _components/widgets/RecentTickets.tsx
"use client";

import { Suspense } from "react";
import { Card, Stack, Text, Badge, Skeleton, Title, Group } from "@repo/mantine-ui";
import { api } from "#/trpc/react";
import { useWorkspaceRouter } from "#/hooks/useWorkspaceRouter";

function RecentTicketsContent() {
  const router = useWorkspaceRouter();
  const [tickets] = api.tickets.getRecentTickets.useSuspenseQuery({ limit: 5 });

  if (tickets.length === 0) {
    return (
      <Card>
        <Text c="dimmed" ta="center">No recent tickets</Text>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Section p="md" withBorder>
        <Group justify="space-between">
          <Title order={4}>Recent Tickets</Title>
          <Badge>{tickets.length}</Badge>
        </Group>
      </Card.Section>

      <Card.Section p="md">
        <Stack gap="xs">
          {tickets.map(ticket => (
            <Card
              key={ticket.id}
              withBorder
              padding="sm"
              onClick={() => router.push(`/tickets/view/${ticket.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <Group justify="space-between">
                <Text fw={500}>{ticket.title}</Text>
                <Badge color={ticket.priority === 'high' ? 'red' : 'blue'}>
                  {ticket.status}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed">{ticket.description}</Text>
            </Card>
          ))}
        </Stack>
      </Card.Section>
    </Card>
  );
}

export function RecentTicketsWidget() {
  return (
    <Suspense
      fallback={
        <Card>
          <Skeleton height={250} />
        </Card>
      }
    >
      <RecentTicketsContent />
    </Suspense>
  );
}
```

### Example 3: Role-Based Widget Configuration
```typescript
// Source: Common RBAC patterns + existing profile structure
// _components/role-configs/index.ts
import type { ComponentType } from "react";
import {
  RecentTicketsWidget,
  PendingActionsWidget,
  MyAssignmentsWidget,
  StaffingUpdatesWidget,
  InventoryAlertsWidget
} from "../widgets";

interface WidgetConfig {
  component: ComponentType;
  span: { base: number; md: number; lg: number };
  key: string;
}

interface RoleConfig {
  title: string;
  subtitle: string;
  widgets: WidgetConfig[];
}

export const ROLE_CONFIGS: Record<string, RoleConfig> = {
  admin: {
    title: "Admin Dashboard",
    subtitle: "System overview and pending actions",
    widgets: [
      {
        component: PendingActionsWidget,
        span: { base: 12, md: 6, lg: 6 },
        key: "pending-actions"
      },
      {
        component: RecentTicketsWidget,
        span: { base: 12, md: 6, lg: 6 },
        key: "recent-tickets"
      },
      {
        component: StaffingUpdatesWidget,
        span: { base: 12, md: 12, lg: 12 },
        key: "staffing-updates"
      },
    ]
  },

  manager: {
    title: "Manager Dashboard",
    subtitle: "Your team and projects",
    widgets: [
      {
        component: PendingActionsWidget,
        span: { base: 12, md: 6, lg: 6 },
        key: "pending-actions"
      },
      {
        component: RecentTicketsWidget,
        span: { base: 12, md: 6, lg: 6 },
        key: "recent-tickets"
      },
    ]
  },

  employee: {
    title: "Welcome Back",
    subtitle: "Your assignments and tickets",
    widgets: [
      {
        component: MyAssignmentsWidget,
        span: { base: 12, md: 12, lg: 12 },
        key: "my-assignments"
      },
      {
        component: RecentTicketsWidget,
        span: { base: 12, md: 12, lg: 12 },
        key: "my-tickets"
      },
    ]
  },
};

// Fallback for unknown roles
export const DEFAULT_CONFIG = ROLE_CONFIGS.employee;
```

### Example 4: Dashboard Component with Grid Layout
```typescript
// Source: Mantine Grid docs + TrueUp patterns
// _components/WelcomeDashboard.tsx
"use client";

import { Grid, Stack, Title, Text } from "@repo/mantine-ui";
import { api } from "#/trpc/react";
import { ROLE_CONFIGS, DEFAULT_CONFIG } from "./role-configs";
import { TopPageWrapper } from "#/core/components/top-page-wrapper/TopPageWrapper";

export function WelcomeDashboard() {
  const [profile] = api.profiles.getProfileByUserLogged.useSuspenseQuery();

  const config = ROLE_CONFIGS[profile.aclRole] || DEFAULT_CONFIG;

  return (
    <TopPageWrapper pageTitle={config.title}>
      <Stack gap="xl">
        {/* Personalized greeting */}
        <div>
          <Title order={2}>
            Welcome back, {profile.firstName}!
          </Title>
          <Text c="dimmed">{config.subtitle}</Text>
        </div>

        {/* Widget grid */}
        <Grid>
          {config.widgets.map(({ component: Widget, span, key }) => (
            <Grid.Col key={key} span={span}>
              <Widget />
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </TopPageWrapper>
  );
}
```

### Example 5: Real-Time Dashboard Updates
```typescript
// Source: apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/context/realtime-context.tsx
// _components/WelcomeDashboard.tsx (extended with real-time)
"use client";

import { useEffect } from "react";
import { Grid, Stack, Title, Text } from "@repo/mantine-ui";
import { api } from "#/trpc/react";
import { supabaseBrowserClient as supabase } from "#/utils/supabase/client";
import { ROLE_CONFIGS, DEFAULT_CONFIG } from "./role-configs";

export function WelcomeDashboard() {
  const utils = api.useUtils();
  const [profile] = api.profiles.getProfileByUserLogged.useSuspenseQuery();

  const config = ROLE_CONFIGS[profile.aclRole] || DEFAULT_CONFIG;

  // Setup real-time subscriptions
  useEffect(() => {
    const setupRealtime = async () => {
      await supabase.realtime.setAuth();

      const channel = supabase
        .channel("dashboard_updates")
        // Subscribe to tickets changes
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "tks_tickets" },
          () => {
            utils.tickets.getRecentTickets.invalidate();
            utils.tickets.getMyTickets.invalidate();
          }
        )
        // Subscribe to staffing changes
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "staffing_assignments" },
          () => {
            utils.staffing.getMyCurrentAssignment.invalidate();
            utils.staffing.getPendingActions.invalidate();
          }
        )
        .subscribe((status, error) => {
          if (error) {
            console.error("Dashboard realtime error:", error);
          }
          console.log("Dashboard realtime status:", status);
        });

      return () => {
        channel.unsubscribe();
      };
    };

    const cleanupPromise = setupRealtime();
    return () => {
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, [utils]);

  return (
    <Stack gap="xl">
      <div>
        <Title order={2}>Welcome back, {profile.firstName}!</Title>
        <Text c="dimmed">{config.subtitle}</Text>
      </div>

      <Grid>
        {config.widgets.map(({ component: Widget, span, key }) => (
          <Grid.Col key={key} span={span}>
            <Widget />
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client-side only dashboards | React Server Components + client hydration | Next.js 13+ (2023) | Faster initial loads, better SEO |
| Custom drag-drop widgets | Static role-based layouts | Industry shift 2024-2025 | Simpler, better UX for defined roles |
| Polling for updates | WebSocket/Realtime subscriptions | 2020s | True real-time, lower server load |
| Individual data fetching | Parallel prefetch + batching | React Query v4+ (2022) | Eliminates waterfalls |
| All-client Suspense | Hybrid RSC + client Suspense | React 18+ (2022) | Better performance, progressive enhancement |
| Full dashboard re-render | Granular query invalidation | React Query v3+ (2021) | Smoother updates, less jank |

**Deprecated/outdated:**
- **Dashboard drag-and-drop for MVP**: Industry moving toward curated, role-based experiences. Save customization for later iterations.
- **useEffect for data fetching**: Replaced by Suspense + useSuspenseQuery pattern in React 19
- **Global loading states**: Replaced by granular Suspense boundaries per widget
- **Prop drilling for user context**: Profile available via tRPC query, no need for context

## Open Questions

Things that couldn't be fully resolved:

1. **Widget Refresh Frequency**
   - What we know: Supabase Realtime provides instant updates
   - What's unclear: User preference for update frequency (too many updates = jarring)
   - Recommendation: Start with real-time invalidation, add debouncing (100-500ms) if users report jank. Consider user preference setting in Phase 4+.

2. **Mobile Widget Experience**
   - What we know: Vertical stacking works, existing app has mobile users
   - What's unclear: Which widgets are most important on mobile, should some be hidden?
   - Recommendation: Show all widgets vertically on mobile for MVP, gather usage analytics to optimize in later phase.

3. **Widget Data Staleness Tolerance**
   - What we know: React Query caches data, refetchOnWindowFocus available
   - What's unclear: How stale is too stale for each widget type?
   - Recommendation: Use staleTime: 30000 (30s) for tickets, 60000 (60s) for staffing. Tune based on user feedback.

4. **Empty State Handling**
   - What we know: Mantine has Empty component, need design
   - What's unclear: Should empty widgets show helpful actions (CTAs) or just empty message?
   - Recommendation: Show actionable CTAs ("Create your first ticket") rather than passive empty states. Increases engagement.

5. **Performance Budget**
   - What we know: RSC + Suspense improves performance
   - What's unclear: Target metrics (LCP, TTI) for dashboard with 4-6 widgets
   - Recommendation: Target LCP <2.5s, TTI <3.5s on 4G. Monitor with PostHog (already in project).

## Sources

### Primary (HIGH confidence)
- [tRPC v11 React Query Integration](https://trpc.io/docs/client/tanstack-react-query/server-components) - RSC patterns
- [tRPC useQueries Documentation](https://trpc.io/docs/client/react/useQueries) - Parallel data fetching
- [React 19 Suspense Reference](https://react.dev/reference/react/Suspense) - Suspense boundaries
- [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime) - Real-time subscriptions
- [Next.js 15 App Router Documentation](https://nextjs.org/docs/app) - Server Components, prefetch patterns
- Existing codebase: `apps/web/src/app/(application)/app/(staffing)/staffing-board/_src/context/realtime-context.tsx` - Real-time patterns
- Existing codebase: `apps/web/src/app/(application)/app/(inventory)/inventory/dashboard/` - Dashboard structure
- Existing codebase: `packages/db/src/schema/profiles.table.ts` - User profile with aclRole

### Secondary (MEDIUM confidence)
- [Building Customizable Dashboard Widgets Using React Grid Layout](https://medium.com/@antstack/building-customizable-dashboard-widgets-using-react-grid-layout-234f7857c124) - Widget architecture
- [React Server Components for Enterprise Applications](https://medium.com/@vasanthancomrads/react-server-components-for-enterprise-applications-bc445e1cd572) - RSC dashboard patterns
- [Next.js SaaS Dashboard Development: Scalability & Best Practices](https://www.ksolves.com/blog/next-js/best-practices-for-saas-dashboards) - Performance optimization
- [Building a Scalable Dashboard in Next.js with Role-Based Access](https://medium.com/@shankhwarshipra2001/building-a-scalable-dashboard-in-next-js-with-role-based-access-and-language-support-755f5bccb9dd) - RBAC patterns
- [React 19: Suspense Enhancements and Improved Component Loading](https://zircon.tech/blog/react-19-suspense-enhancements-and-improved-component-loading/) - React 19 Suspense improvements

### Tertiary (LOW confidence - community patterns)
- [Dashboard Design UX Patterns Best Practices](https://www.pencilandpaper.io/articles/ux-pattern-analysis-data-dashboards) - UX principles
- [9 Dashboard Design Principles (2026)](https://www.designrush.com/agency/ui-ux-design/dashboard/trends/dashboard-design-principles) - Design guidelines
- [Bad Dashboard Examples: Common Mistakes](https://databox.com/bad-dashboard-examples) - Pitfalls to avoid
- [ReactJS Development for Real-Time Analytics Dashboards](https://makersden.io/blog/reactjs-dev-for-real-time-analytics-dashboards) - Real-time patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in project, proven patterns
- Architecture: HIGH - Based on official docs + existing codebase patterns
- Pitfalls: MEDIUM - Based on community patterns + general React/Next.js experience

**Research date:** 2026-01-27
**Valid until:** 2026-02-27 (30 days - stable technologies, but fast-moving frontend ecosystem)

**Key caveats:**
- React Grid Layout research included but NOT recommended for MVP (adds complexity)
- Widget customization patterns researched but deferred to later phase
- Chart library (Recharts/Tremor) not deeply researched - validate if widgets need visualization
- Mobile experience needs validation with actual users (assumptions based on general best practices)
