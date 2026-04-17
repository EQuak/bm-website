# Requirements: TrueUp Companies ERP

**Defined:** 2026-01-26
**Core Value:** Completely migrate from the legacy PHP system to the new system

## v1 Requirements

Requirements to complete migration and allow abandonment of legacy system.

### Staffing Board

- [x] **STAFF-01**: Empty project cards occupy minimum space (not ~300px)
- [x] **STAFF-02**: "Add user" button maintains compact size even when project has no users
- [x] **STAFF-03**: Better overall space utilization on the whiteboard
- [ ] **STAFF-04**: User can add Notes (persisted post-its) to projects
- [ ] **STAFF-05**: Dragging employee to Home removes from project, changes status and sets exit date
- [ ] **STAFF-06**: Dragging employee to another project copies complete assignment
- [ ] **STAFF-07**: Employee cards have visible drag handle
- [x] **STAFF-08**: Horizontal scrollbar visible and accessible for Windows/mouse users

### Analytics

- [ ] **ANLYT-01**: PostHog events track critical actions (tickets, inventory, staffing)
- [ ] **ANLYT-02**: Funnel metrics and time to complete actions

### Mobile

- [ ] **MOBIL-01**: Expo Router updated for iOS 26 compatibility
- [ ] **MOBIL-02**: Google account configured for testing
- [ ] **MOBIL-03**: Beta deploy on official company account
- [ ] **MOBIL-04**: Real Supabase connection tested and working

### Welcome Pages

- [ ] **WELCM-01**: Personalized welcome page by user profile
- [ ] **WELCM-02**: Dashboard widgets show relevant information (recent tickets, etc.)

### Developer Tooling

- [ ] **IMPER-01**: Developer can impersonate any profile via cookie-based approach (full profile swap)
- [ ] **IMPER-02**: Visual indicator and stop mechanism for impersonation (red badge + menu button)

## v2 Requirements

Deferred until after complete migration.

### Admin & Tooling

- **ADMIN-01**: Dashboard shows logged-in users and active sessions
- **ADMIN-02**: Usage logs and system metrics visible to admin
- **TOOLN-01**: Visual Form Builder to configure ticket custom fields

## Out of Scope

Explicitly excluded from current scope.

| Feature | Reason |
|---------|--------|
| New non-essential features | Focus is completing migration, not expanding functionality |
| Refactoring stable modules | Inventory, Employees work well, don't touch |
| Complete visual redesign | Current system is functional, only targeted improvements |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| STAFF-01 | Phase 1 | Complete |
| STAFF-02 | Phase 1 | Complete |
| STAFF-03 | Phase 1 | Complete |
| STAFF-08 | Phase 1 | Complete |
| STAFF-04 | Phase 2 | Pending |
| STAFF-05 | Phase 2 | Pending |
| STAFF-06 | Phase 2 | Pending |
| STAFF-07 | Phase 2 | Pending |
| WELCM-01 | Phase 3 | Pending |
| WELCM-02 | Phase 3 | Pending |
| MOBIL-01 | Phase 4 | Pending |
| MOBIL-02 | Phase 4 | Pending |
| MOBIL-03 | Phase 5 | Pending |
| MOBIL-04 | Phase 5 | Pending |
| ANLYT-01 | Phase 6 | Pending |
| ANLYT-02 | Phase 6 | Pending |
| IMPER-01 | Phase 7 | Pending |
| IMPER-02 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 18 total
- Mapped to phases: 18
- Unmapped: 0

---
*Requirements defined: 2026-01-26*
*Last updated: 2026-02-26 — Phase 7 requirements added*
