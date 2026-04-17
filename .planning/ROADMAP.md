# Roadmap: TrueUp Companies ERP

## Overview

This roadmap delivers the remaining features needed to complete migration from the legacy PHP system. The journey focuses on four key areas: enhancing the Staffing Board (UI optimization and interactive features), creating personalized welcome pages, preparing and deploying the mobile app for beta testing, and integrating comprehensive analytics tracking. Each phase delivers observable capabilities that bring the system closer to full PHP replacement.

## Phases

- [x] **Phase 1: Staffing Board - UI Compaction** - Optimize screen space usage for better project visibility
- [x] **Phase 2: Staffing Board - Interactive Features** - Enable fluid drag & drop interactions and persistent notes
- [ ] **Phase 3: Welcome Pages** - Create personalized user entry points (web app, easier)
- [ ] **Phase 4: Mobile Infrastructure** - Update Expo Router, iOS 26 compatibility, code cleanup
- [ ] **Phase 5: Mobile Beta Deployment** - Configure accounts, stores, deploy beta for testing
- [ ] **Phase 6: Analytics Integration** - Implement comprehensive event tracking and metrics

## Phase Details

### Phase 1: Staffing Board - UI Compaction

**Goal**: Users can see more projects and employee assignments on screen without excessive scrolling
**Depends on**: Nothing (first phase)
**Requirements**: STAFF-01, STAFF-02, STAFF-03, STAFF-08
**Success Criteria** (what must be TRUE):

1. Empty project cards occupy minimal vertical space (much less than current ~300px)
2. Add user button remains compact even when projects have no users
3. Multiple projects visible simultaneously on typical screens without scrolling
4. Windows/mouse users can easily see and use horizontal scrollbar
   **Plans**: 1 plan

Plans:

- [x] 01-01: Spacing and Scrollbar Compaction (completed 2026-01-27)

### Phase 2: Staffing Board - Interactive Features

**Goal**: Users can manage employee assignments fluidly via drag & drop and track context with persistent notes
**Depends on**: Phase 1 (UI foundation in place)
**Requirements**: STAFF-04, STAFF-05, STAFF-06, STAFF-07
**Success Criteria** (what must be TRUE):

1. User can create, edit, and delete notes on projects (persisted to database)
2. User can drag employee to Home column to remove from project (updates status and exit date)
3. User can drag employee to another project to copy full assignment details
4. Drag handles are visible on employee cards making interaction discoverable
5. All drag operations use optimistic updates without confirmation popups
   **Plans**: 4 plans

Plans:

- [x] 02-01-PLAN.md — Drag foundation: make assignment cards draggable with grip handles + dual-type overlay (completed 2026-02-06)
- [x] 02-02-PLAN.md — Post-it notes: colored cards with CRUD, popover editor, color picker (completed 2026-02-06)
- [x] 02-03-PLAN.md — DnD wiring: 3-scenario handler (employee→project, assignment→home, assignment→project) (completed 2026-02-06)
- [x] 02-04-PLAN.md — Human verification: all interactive features working together (completed 2026-02-06)

### Phase 3: Welcome Pages

**Goal**: Users have personalized dashboard experience based on their profile and role
**Depends on**: Nothing (uses existing user profile system)
**Requirements**: WELCM-01, WELCM-02
**Success Criteria** (what must be TRUE):

1. User sees customized welcome page on login based on their role/profile
2. Dashboard displays relevant widgets (recent tickets, pending actions, etc.)
3. Widgets show real-time or near-real-time data from user's workspace
4. Navigation from dashboard to key features is intuitive and fast
   **Plans**: 2 plans

Plans:

- [ ] 03-01-PLAN.md -- Dashboard API layer and role-based widget configuration
- [ ] 03-02-PLAN.md -- Welcome page UI with widget components and real-time updates

### Phase 4: Mobile Infrastructure

**Goal**: Mobile app code is updated, cleaned, and ready for beta deployment
**Depends on**: Nothing (parallel track from web work)
**Requirements**: MOBIL-01, MOBIL-02
**Success Criteria** (what must be TRUE):

1. Expo Router updated to latest version with iOS 26 compatibility
2. App runs correctly on both iOS and Android simulators
3. Code cleaned up - no broken components, missing visualizations, or stale code
4. All existing modules (inventory, employees, tickets) render correctly
5. Development environment validated with updated dependencies
   **Plans**: 3 plans

Plans:

- [ ] 04-01-PLAN.md -- Update Expo SDK 54 dependencies and configure monorepo hoisting
- [ ] 04-02-PLAN.md -- Create EAS Build profiles and complete app config with bundle IDs
- [ ] 04-03-PLAN.md -- Code cleanup, TypeScript fixes, and simulator verification

### Phase 5: Mobile Beta Deployment

**Goal**: Mobile app deployed for real-world testing with proper store configuration
**Depends on**: Phase 4 (code ready)
**Requirements**: MOBIL-03, MOBIL-04
**Success Criteria** (what must be TRUE):

1. Google Play Console account configured for company
2. Apple Developer account configured for company
3. Beta app deployed to both stores (TestFlight + Google Play Beta)
4. App screenshots, descriptions, and metadata submitted
5. Testers can authenticate via Supabase using company credentials
6. App successfully loads and displays real data from production database
   **Plans**: TBD

Plans:

- [ ] 05-01: TBD during planning
- [ ] 05-02: TBD during planning
- [ ] 05-03: TBD during planning

### Phase 6: Analytics Integration

**Goal**: Team has visibility into user behavior and system usage patterns via PostHog
**Depends on**: Phases 1-5 (track events from completed features)
**Requirements**: ANLYT-01, ANLYT-02
**Success Criteria** (what must be TRUE):

1. Critical actions tracked with PostHog events (create ticket, inventory changes, staffing operations)
2. Funnel metrics show user journey through key workflows
3. Time-to-completion metrics available for common tasks
4. Dashboard shows usage patterns and feature adoption
   **Plans**: TBD

Plans:

- [ ] 06-01: TBD during planning
- [ ] 06-02: TBD during planning

## Progress

| Phase                                    | Plans Complete | Status      | Completed  |
| ---------------------------------------- | -------------- | ----------- | ---------- |
| 1. Staffing Board - UI Compaction        | 1/1            | Complete    | 2026-01-27 |
| 2. Staffing Board - Interactive Features | 4/4            | Complete    | 2026-02-06 |
| 3. Welcome Pages                         | 0/2            | Planned     | -          |
| 4. Mobile Infrastructure                 | 0/3            | Planned     | -          |
| 5. Mobile Beta Deployment                | 0/TBD          | Not started | -          |
| 6. Analytics Integration                 | 0/TBD          | Not started | -          |

### Phase 7: Add developer profile impersonation via cookie-based approach

**Goal:** Developer users can impersonate any profile via a cookie-based swap, with full visual indicators and easy stop mechanism
**Depends on:** Nothing (independent developer tooling)
**Requirements:** IMPER-01, IMPER-02
**Success Criteria** (what must be TRUE):

1. Developer user can select any profile to impersonate from a searchable combobox in Developer Tools settings page
2. Impersonated profile replaces the real one everywhere — roles, permissions, data scoping, menus all follow naturally
3. Red pulsing indicator on sidebar avatar makes impersonation status unmistakable
4. "Stop Impersonating" button in user menu clears the cookie and restores real profile
5. Non-developer users cannot see or access Developer Tools page
6. Cookie persists across page navigation and browser restarts (24-hour expiry)
   **Plans:** 2 plans

Plans:
- [x] 07-01-PLAN.md — Backend: cookie-based profile swap in getProfileByUserLogged + getRealProfile procedure (completed 2026-02-26)
- [x] 07-02-PLAN.md — Frontend: Developer Tools page, nav link, visual indicator, stop button (completed 2026-02-26)

---

_Created: 2026-01-26_
_Last updated: 2026-02-26 — Phase 7 complete: developer profile impersonation fully shipped and verified_
