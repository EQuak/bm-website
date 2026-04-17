# Project Knowledge Base

**Product goals and intent** live in [`docs/PROJECT_INTENT.md`](../../docs/PROJECT_INTENT.md) (repo root `docs/`). This file is for **ongoing learnings and decisions**, not the product brief.

## How to Use This Document

This is a living document that captures project knowledge, learnings, and best practices. Each entry should be categorized and include relevant context and examples.

## Structure

Each entry should follow this format:

```markdown
### [Category] Topic Title

**Date**: YYYY-MM-DD
**Context**: Brief description of the situation or problem
**Learning**: What was learned or decided
**Implementation**: How to implement this learning (code examples, patterns, etc.)
**References**: Links to relevant files, PRs, or discussions (if applicable)
```

## Categories

- 🏗️ Architecture
- 🧪 Testing
- 🔒 Security
- 🎨 UI/UX
- 🔧 Development
- 🐛 Bug Fixes
- 🚀 Performance
- 📦 Dependencies
- 🔄 Workflows

## Entries

### [🔧 Development] Proper Error Handling in API Routes

**Date**: 2024-03-19
**Context**: Need for consistent error handling across API routes
**Learning**: All API routes should follow a standard error handling pattern
**Implementation**:

```typescript
try {
  // API logic here
} catch (error) {
  if (error instanceof TRPCError) {
    throw error;
  }

  // Log to Sentry
  captureException(error);

  // Return typed error response
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
    cause: error,
  });
}
```

**References**:

- `.cursorrules` API Structure section
- Example implementation in `api/src/router/departments.ts`

### [🧪 Testing] E2E Test Authentication Setup

**Date**: 2024-03-19
**Context**: Need for consistent auth handling in E2E tests
**Learning**: Use Playwright's built-in auth storage to avoid repeated logins
**Implementation**:

1. Setup auth state once:

```typescript
await page.goto("/auth/login");
await page.fill("[name=email]", test.use.email);
await page.fill("[name=password]", test.use.password);
await page.click("button[type=submit]");
await page.waitForURL("/dashboard");
await page.context().storageState({ path: ".auth/user.json" });
```

2. Reuse in test config:

```typescript
use: {
  storageState: ".auth/user.json";
}
```

**References**:

- `web/playwright.config.ts`
- `web/tests/auth.setup.ts`

### [🐛 Bug Fixes] DatePicker Timezone Issues with Date Objects

**Date**: 2026-02-03
**Context**: When using Mantine's DatePickerInput with dayjs for API calls, dates were being shifted by one day due to timezone conversion
**Learning**: DatePickerInput returns Date objects at midnight local time. When formatted with dayjs without proper handling, negative timezones (e.g., UTC-3) cause dates to shift backward. The safest approach is to extract the date components directly from the Date object without using dayjs.
**Implementation**:

```typescript
// WRONG - causes timezone shift in negative timezones
startDate: dayjs(startDate).format("YYYY-MM-DD"),

// WRONG - requires UTC plugin to be initialized (not always available)
startDate: dayjs(startDate).utc().format("YYYY-MM-DD"),

// CORRECT - extracts date components directly from Date object
const formatDateToString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

startDate: formatDateToString(startDate),
```

**Explanation**:

- DatePickerInput returns a Date object representing midnight local time (e.g., "2026-02-03T00:00:00-03:00" in Brasília)
- Internally this is stored as UTC timestamp "2026-02-03T03:00:00Z"
- When using dayjs without UTC plugin initialized, it converts back to local time, potentially extracting the wrong date
- Using native Date methods (`getFullYear()`, `getMonth()`, `getDate()`) preserves the calendar date as selected by the user
- This approach works regardless of whether dayjs UTC plugin is initialized

**References**:

- `apps/web/src/app/(application)/app/(hr)/hr/timesheet-conversion/components/ApiImportForm.tsx`
