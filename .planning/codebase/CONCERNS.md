# Codebase Concerns

**Analysis Date:** 2026-01-26

## Tech Debt

**Commented-out RBAC enforcement in adminProtectedProcedure:**
- Issue: Admin role checking is commented out, allowing any authenticated user to access admin procedures
- Files: `packages/api/src/trpc.ts` (lines 151-153)
- Impact: Administrative endpoints lack proper authorization, creating security risk for sensitive operations
- Fix approach: Uncomment and properly validate admin role in all admin procedures using app_metadata or database-stored roles

**Incomplete custom permissions implementation in ability system:**
- Issue: Custom permissions block is fully commented out in RBAC ability definition
- Files: `apps/web/src/core/context/rbac/ability.ts` (lines 51-66)
- Impact: Custom per-user permissions cannot be applied; only role-based permissions work
- Fix approach: Complete implementation and test custom permission handling with proper merge strategy

**Console logging in production code:**
- Issue: Multiple console.log/console.error statements left in production files without log level control
- Files:
  - `packages/api/src/utils/handleError.ts` (line 3-4)
  - `packages/api/src/trpc.ts` (line 98)
  - `packages/api/src/funcs/work_orders/uploadPDFAttachment.ts` (lines 30, 34, 43, 49, 72)
- Impact: Sensitive data may leak to logs; no structured logging for production monitoring
- Fix approach: Replace console calls with proper structured logging (e.g., Pino or Winston) with environment-aware log levels

**Password handling in auth function using require():**
- Issue: bcryptjs imported via require() instead of ES import
- Files: `packages/api/src/funcs/auth.funcs.ts` (line 14)
- Impact: Not tree-shakeable, harder to audit, inconsistent with codebase patterns
- Fix approach: Convert to ES import: `import bcrypt from "bcryptjs"`

## Known Bugs

**File upload lacks size and type validation:**
- Symptoms: PDF uploads accept any size without validation; filename generation uses nanoid but doesn't enforce file extension consistency
- Files: `packages/api/src/funcs/work_orders/uploadPDFAttachment.ts` (lines 18, 24-26)
- Trigger: Uploading large files or non-PDF files to work orders
- Workaround: None; relies on client-side validation

**Error responses expose implementation details:**
- Symptoms: catch blocks return null without proper error context to caller
- Files: `packages/api/src/funcs/work_orders/uploadPDFAttachment.ts` (lines 29-31, 42-44, 48-50)
- Trigger: Any upload failure silently returns null instead of detailed error
- Workaround: Check for null and show generic error; no way to distinguish causes

## Security Considerations

**SQL template literal usage in search operations:**
- Risk: While using parameterized queries, search input sanitization relies on Drizzle; pattern could be misused
- Files:
  - `packages/api/src/funcs/reports.funcs.ts` (lines with searchText LIKE patterns)
  - `packages/api/src/funcs/inventory/items.funcs.ts`
- Current mitigation: Drizzle ORM parameterizes all values; direct string concatenation not observed
- Recommendations: Add input validation for search length (max 100 chars) to prevent DOS via expensive LIKE queries

**Authentication token extraction from headers:**
- Risk: Bearer token extracted from Authorization header and passed to Supabase without additional validation
- Files: `packages/api/src/trpc.ts` (lines 33-35)
- Current mitigation: Supabase validates token signature; getClaims() method handles validation
- Recommendations: Add token expiration checks and consider implementing request signing for critical operations

**Supabase admin client exposed in context:**
- Risk: supabaseAdmin passed to all protected procedures, enabling privilege escalation if procedures are compromised
- Files: `packages/api/src/trpc.ts` (line 45, passed but partially filtered in publicProcedure)
- Current mitigation: Admin client excluded from publicProcedure middleware
- Recommendations: Create role-based admin procedures that explicitly require admin role; never pass admin client to standard procedures

**File storage bucket lacks RLS policies verification:**
- Risk: Supabase storage bucket "email_attachments" may allow unauthorized access if RLS policies missing
- Files: `packages/api/src/funcs/work_orders/uploadPDFAttachment.ts` (line 23)
- Current mitigation: Signed URLs expire in 24 hours
- Recommendations: Verify RLS policies exist on all storage buckets; implement signed URLs with shorter expiration for sensitive documents

**Signed URL expiration too long:**
- Risk: 24-hour expiration allows long window for URL interception/sharing
- Files: `packages/api/src/funcs/work_orders/uploadPDFAttachment.ts` (line 40)
- Current mitigation: Only used for email attachments (one-time access pattern)
- Recommendations: Reduce expiration to 1 hour; implement expiring token mechanism for one-time URLs if needed

**Environment variable structure stored in JSON string:**
- Risk: SECRET_CLIENT_COOKIE_VAR stored as JSON string in .env.example; actual secrets management unclear
- Files: `.env.example` (line 12)
- Current mitigation: Example shows demo values only
- Recommendations: Document secret rotation policy; consider using secret management service for production

## Performance Bottlenecks

**Large form components with 1000+ lines:**
- Problem: Multiple 1000+ line components make rendering and maintenance difficult
- Files:
  - `apps/mobile/src/components/react-form/dynamic-field.tsx` (1796 lines)
  - `apps/web/src/utils/form-builder/dynamic-field.tsx` (1096 lines)
  - `apps/web/src/app/(application)/app/(hr)/hr/workday-projects/page.tsx` (1025 lines)
  - `apps/web/src/app/(application)/app/(hr)/hr/timesheet-conversion/components/ConversionTable.tsx` (982 lines)
- Cause: Multiple field types handled in single switch statement; no component decomposition
- Improvement path: Break into focused sub-components per field type; extract common logic into hooks

**Unconditional employee data fetch in dynamic fields:**
- Problem: getAllProfilesAlphabetically fetched for every processing_poc field on page, even if field not visible
- Files: `apps/web/src/utils/form-builder/dynamic-field.tsx` (lines 49-54)
- Cause: Query runs at component render time without parent-level coordination
- Improvement path: Hoist query to parent page; use useSuspenseQuery cache; implement field visibility check before querying

**Query timing middleware adds 100-400ms artificial delay in development:**
- Problem: Random delay injected into every tRPC call in dev mode impacts perceived performance
- Files: `packages/api/src/trpc.ts` (lines 89-93)
- Cause: Intentional dev aid but impacts development experience
- Improvement path: Make optional via environment variable; move to profiling tool instead

**Potential N+1 queries in profile/job position lookups:**
- Problem: Projects.funcs.ts queries profiles after fetching projects, may not use batching
- Files: `packages/api/src/funcs/projects/projects.funcs.ts` (Step 3 queries)
- Cause: No explicit batch loading or include relations
- Improvement path: Use Drizzle relations with `with:` clause; verify query plan with db.studio

## Fragile Areas

**Dynamic field form builder - switch statement complexity:**
- Files: `apps/web/src/utils/form-builder/dynamic-field.tsx` and `apps/mobile/src/components/react-form/dynamic-field.tsx`
- Why fragile: 1000+ line switch statements with duplicate logic across two files (web/mobile); adding new field types requires changes in multiple places
- Safe modification: Extract field type handlers into separate files/functions before adding new types; create shared utilities in form-builder package
- Test coverage: No test files found for form builder components; switch logic untested

**Async outbox event processing - manual transaction coordination:**
- Files: `packages/api/src/async/producers/tickets.producer.ts`, `packages/api/src/async/async_mutations.ts`
- Why fragile: Event insertion must happen in same transaction as main operation; comments warn about requirement but enforcement is manual
- Safe modification: Create wrapper functions that ensure transaction scoping; consider outbox pattern library
- Test coverage: No tests found for outbox event ordering or failure scenarios

**RBAC ability definition - hardcoded module names:**
- Files: `apps/web/src/core/context/rbac/ability.ts` (lines 68-70)
- Why fragile: Dashboard, settings, settings-profile hard-coded with "can view"; no type safety
- Safe modification: Generate from schema; add TypeScript validation for module names
- Test coverage: No RBAC tests found; ability definitions not validated

**File upload without retry mechanism:**
- Files: `packages/api/src/funcs/work_orders/uploadPDFAttachment.ts`
- Why fragile: Silent failures return null; no automatic retry; caller cannot distinguish transient vs permanent failures
- Safe modification: Implement exponential backoff; return typed errors instead of null; add max retry count
- Test coverage: No tests for upload function

## Scaling Limits

**Single admin client for entire application:**
- Current capacity: One admin Supabase client shared across all admin operations
- Limit: If one operation blocks or has rate limit, impacts all admin operations
- Scaling path: Implement request queuing; separate admin clients per operation type; add rate limit handling

**Synchronous PDF generation during request:**
- Current capacity: PDF generation in work-orders blocks request until complete
- Limit: Large PDFs or high concurrency will cause request timeouts (Next.js default 30s)
- Scaling path: Move PDF generation to Trigger.dev background job; return job ID immediately; poll for completion

**Form builder with embedded employee lookup:**
- Current capacity: Single getAllProfilesAlphabetically query per page; suitable for <5000 employees
- Limit: Performance degrades with large employee directories; no pagination
- Scaling path: Implement searchable select with server-side filtering; add virtual scrolling; cache for 1 hour

## Dependencies at Risk

**bcryptjs via require() import:**
- Risk: CommonJS require in ES module; type safety compromised; not tree-shakeable
- Impact: Harder to audit, inconsistent module system usage
- Migration plan: Switch to `import bcrypt from "bcryptjs"` with proper type definitions

**No standardized structured logging:**
- Risk: console.log statements scattered throughout; no way to filter, aggregate, or search logs
- Impact: Production debugging difficult; PostHog integration covers events but not logs
- Migration plan: Implement Pino or similar; create logger factory; replace all console calls

## Missing Critical Features

**No request rate limiting:**
- Problem: API endpoints lack rate limiting; exposed to abuse
- Blocks: Cannot safely expose API to untrusted clients; DDoS protection missing

**No request validation middleware:**
- Problem: Some endpoints lack input size limits; no Content-Length checks
- Blocks: Cannot defend against malformed requests causing server resource exhaustion

**No audit logging for sensitive operations:**
- Problem: No logging of auth events, role changes, file uploads, or data exports
- Blocks: Cannot investigate security incidents or meet compliance requirements

**No database connection pooling configuration:**
- Problem: .env.example shows pooling options commented out; unclear which is production default
- Blocks: Scaling to multiple app instances difficult; connection exhaustion risk

**No request tracing/correlation IDs:**
- Problem: Cannot trace user requests through logs without manually looking up timestamps
- Blocks: Production debugging requires looking at raw logs instead of traces

## Test Coverage Gaps

**API funcs layer has minimal test coverage:**
- What's not tested: Business logic in auth.funcs.ts, inventory transactions, work orders, employee certifications
- Files: `packages/api/src/funcs/` (only 1 test file found: conversion.test.ts)
- Risk: Changes to business logic could have unintended side effects; regressions undetected
- Priority: High - Core business operations lack safety nets

**Form field validation logic untested:**
- What's not tested: Dynamic field rendering, validation rules per field type, error message display
- Files: `apps/web/src/utils/form-builder/dynamic-field.tsx`, `apps/mobile/src/components/react-form/dynamic-field.tsx`
- Risk: Form changes could silently break submission for certain field types
- Priority: High - User-facing functionality

**RBAC and permission system untested:**
- What's not tested: Permission checks in procedures, role-based access control, custom permissions
- Files: `apps/web/src/core/context/rbac/`, `packages/api/src/trpc.ts` (adminProtectedProcedure)
- Risk: Security controls could be bypassed undetected
- Priority: High - Security critical

**Email sending logic untested:**
- What's not tested: Email template rendering, recipient address handling, attachment generation
- Files: `packages/react-email/emails/`, `packages/api/src/funcs/emails/`
- Risk: Users may not receive notifications; attachments may fail silently
- Priority: Medium - User communication

**Database migration consistency untested:**
- What's not tested: Migration ordering, schema consistency after migrations, rollback safety
- Files: `supabase/migrations/` (98 migration files, zero test coverage)
- Risk: Production deployments could fail or corrupt data
- Priority: High - Data integrity critical

---

*Concerns audit: 2026-01-26*
