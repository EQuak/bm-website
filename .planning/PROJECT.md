# TrueUp Companies ERP

## What This Is

Complete ERP system for TrueUp Companies, replacing the legacy PHP system. Manages warehouse operations: inventory, employees, certifications, projects, staffing allocation, and internal tickets. Multi-tenant application with web (Next.js) and mobile (React Native/Expo).

## Core Value

**Completely migrate from the legacy PHP system to the new system, maintaining functional parity and allowing users to abandon the old system.**

If everything else fails, the system needs to work well enough for users to stop using PHP.

## Requirements

### Validated

Modules in operation, running in parallel with legacy system:

- ✓ **Inventory Module** — Stock transactions (in/out), locations, items — existing
- ✓ **Employee Management** — Employee profiles, personal data, employment information — existing
- ✓ **Employee Certifications** — Certifications, acknowledgements, safety training — existing
- ✓ **Tickets System** — Ticket system with custom fields per department (in training phase) — existing
- ✓ **Staffing Board (basic)** — Employee allocation in projects, kanban view — existing
- ✓ **Authentication** — Supabase auth (phone OTP, email, password) — existing
- ✓ **RBAC** — Role-based access control via CASL — existing
- ✓ **Multi-tenant Routing** — Workspace-aware navigation — existing
- ✓ **Mobile App (basic)** — Main modules ported to React Native/Expo — existing
- ✓ **PostHog Integration** — Analytics configured, need to add specific events — existing

### Active

Improvements and features needed to complete migration:

**Staffing Board Improvements:**
- [ ] Compacted empty project cards (from ~300px to minimum)
- [ ] Smaller "add user" button when project already has users
- [ ] Better overall space utilization on the whiteboard
- [ ] Notes feature (post-its persisted to database, below employee list)
- [ ] Drag & Drop: drag employee to Home = remove from project + change status + exit date
- [ ] Drag & Drop: drag employee to another project = copy complete assignment
- [ ] Visible drag handle on employee cards
- [ ] More visible horizontal scrollbar for Windows/mouse users

**Analytics:**
- [ ] PostHog events for critical actions (create ticket, inventory changes, staffing actions)
- [ ] Funnel metrics and time to complete actions

**Mobile App:**
- [ ] Update Expo Router for iOS 26 compatibility
- [ ] Configure Google account for testing
- [ ] Beta deploy on official company account
- [ ] Test real Supabase connection (auth + data)

**Welcome Pages:**
- [ ] Personalized welcome page by user profile
- [ ] Dashboard widgets (recent tickets, pending actions)

### Out of Scope

Deferred until after complete migration:

- **Ticket Form Builder** — Visual viewer/editor for custom fields. System works without this.
- **Admin Session Dashboard** — Monitoring logged-in users/active sessions. Nice-to-have.
- **New non-essential features** — Focus is completing migration, not adding new features.

## Context

**Migration in progress:**
- Legacy PHP system still in parallel use
- Some modules already 100% in the new system
- Users performing same operations in both systems for validation
- Staffing Board in alpha/beta, being compared 1:1 with previous manual process

**Technical environment:**
- Turborepo monorepo with shared packages
- Next.js 16 + React 19 (web)
- Expo 54 + React Native 0.81 (mobile)
- tRPC + Drizzle ORM + PostgreSQL (Supabase)
- Mantine UI v7 + Tailwind CSS
- PostHog for analytics (already configured)
- Trigger.dev for background jobs

**Codebase mapped:**
- `.planning/codebase/` contains complete analysis of existing architecture

## Constraints

- **Tech Stack**: Maintain existing stack (Next.js, tRPC, Drizzle, Supabase, Mantine)
- **Optimistic Updates**: Drag & drop actions must use optimistic updates without popups
- **PHP Parity**: Features must have parity with legacy system before migrating
- **iOS 26**: Mobile needs to work on iOS 26 before official deploy
- **Multi-tenant**: All features must respect existing workspace routing

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Staffing Notes persisted to database | Users want history, not just temporary post-its | — Pending |
| Drag-to-home without popup | More fluid UX, use optimistic update | — Pending |
| Mobile just make it work (no new features) | Priority is validating infrastructure before expanding | — Pending |
| Form Builder deferred | Ticket system works without visualizer, doesn't block migration | ✓ Good |

---
*Last updated: 2026-01-26 after initialization*
