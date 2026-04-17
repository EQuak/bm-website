# Phase 7: Add developer profile impersonation via cookie-based approach - Context

**Gathered:** 2026-02-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Allow admin/developer users to impersonate another user's profile for permission and feature testing. The only change is swapping the profile_id — everything downstream (roles, permissions, data scoping, menus, actions) follows naturally from the existing auth context pipeline. Cookie-based storage keeps it per-browser, non-global, and lightweight with no database schema changes.

</domain>

<decisions>
## Implementation Decisions

### Cookie & session design
- Cookie scoped to current user — value includes both the real user ID and the impersonated profile ID (prevents accidental cross-user impersonation if someone else logs in)
- 24-hour expiry — persists across browser restarts for longer testing sessions
- Readable by both frontend and backend — frontend can read cookie directly for UI indicators without extra API calls
- Cookie mechanism (tRPC mutation vs client-side): Claude's discretion

### Impersonation scope
- Full profile swap — the impersonated profile_id replaces the real one everywhere
- Frontend auth context returns the impersonated profile_id instead of the real one
- Backend resolves the impersonated profile_id when looking up the user's profile
- All downstream behavior stays unchanged: roles, permissions, data scoping, menus, actions like "my tickets" all use the impersonated profile
- Can impersonate any profile — admin can impersonate anyone including other admins (simplest approach, admin already has full access)

### Admin UI location
- New "Developer Tools" page in the Settings sidebar, same level as "User Roles", "Certifications", etc.
- Only visible to users who can access admin settings (manage_all permission — already enforced by being inside settings)
- Combobox with profile details — shows name + role + department in search results for easy identification
- Full page refresh after selecting a profile to impersonate (cleanest, no stale state)

### Stopping impersonation
- "Stop Impersonating" button in the user menu popover (next to Feedback/Profile/Logout) — quick access from anywhere
- Also clearable from the Developer Tools page itself
- Both trigger a full page refresh

### Visual indicator
- Red badge/indicator on the user avatar in the sidebar/header — danger style, impossible to miss
- User menu avatar and name swap to the impersonated user's info — consistent with full profile swap
- Name+role display in the indicator: Claude's discretion

</decisions>

<specifics>
## Specific Ideas

- The profile_id swap happens at the point where the backend resolves the user's profile from the authenticated user_id — find that function and add the impersonation check there
- Frontend auth context already provides the profile — the swap should happen before the context is populated
- The cookie approach was chosen specifically to avoid database changes, keep it per-browser session, and make it easy to remove later if needed
- This is a developer/testing tool, not a long-term production feature — implementation can be pragmatic

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-add-developer-profile-impersonation-via-cookie-based-approach*
*Context gathered: 2026-02-26*
