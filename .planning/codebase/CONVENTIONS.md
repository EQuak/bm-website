# Coding Conventions

**Analysis Date:** 2026-01-26

## Naming Patterns

**Files:**
- React components: `PascalCase.tsx` (e.g., `LoaderPage.tsx`, `EmployeeCard.tsx`)
- Utility functions: `camelCase.ts` (e.g., `create_slug.ts`, `formatDate.ts`)
- Database tables: `snake_case.table.ts` (e.g., `reference_material.table.ts`)
- Router files: `snake_case.router.ts` (e.g., `reference_material.router.ts`)
- Function files: `snake_case.funcs.ts` (e.g., `reference_material.funcs.ts`)

**Functions:**
- PascalCase for React components: `LoaderPage`, `EmployeeCard`
- camelCase for utilities and hooks: `useWorkspaceRouter`, `createSlug`, `handleError`
- camelCase for procedures in routers: `getReferenceMaterialById`, `addReferenceMaterial`

**Variables:**
- camelCase throughout: `selectedStatus`, `jobApplications`, `isScrolled`, `getStatusColor`
- Constants can be UPPER_SNAKE_CASE: `DEFAULT_ROUTE_PATH`, `REQUIRED_WORKSHEET_NAME`

**Types:**
- PascalCase: `JobApplication`, `JobApplicationStatus`, `ReferenceMaterial`
- Zod schemas use camelCase or snake_case depending on context
- Database types suffix with Select/Insert/Update: `ReferenceMaterialSelect`, `ReferenceMaterialInsert`

**Directories:**
- kebab-case: `job-applications`, `employee-cards`, `reference-material`, `top-page-wrapper`
- Feature directories use kebab-case: `(job-applications)`, `(tickets)`, `(auth)`

## Code Style

**Formatting:**
- Tool: Biome (v2.3.8) - unified linter and formatter
- Indent style: 2 spaces
- Line width: 80 characters
- Line ending: LF (Unix)
- Semicolons: asNeeded (omitted unless required)
- Quote style: Double quotes for JSX, JavaScript, and CSS

**Linting:**
- Tool: Biome with strict configuration
- Enforce `const` over `let` (useConst: error)
- Prohibit `var` (noVar: error)
- No explicit `any` types (noExplicitAny: error)
- No empty blocks (noEmptyBlockStatements: error)
- Enforce optional chaining (useOptionalChain: error)
- Enforce shorthand function types (useShorthandFunctionType: error)
- Force await usage (useAwait: off in config, but generally expected)
- No unused variables (noUnusedVariables: warn with unsafe fix)
- No unused imports (noUnusedImports: warn with unsafe fix)

**Type Safety:**
- No `as any` without justification (noExplicitAny: error)
- No `@ts-ignore`, `@ts-expect-error` shortcuts
- TypeScript strict mode enforced
- Always define explicit return types for functions
- Use Zod for runtime validation of inputs

## Import Organization

**Order:**
1. External dependencies (e.g., `import { useState } from "react"`)
2. Internal exports from @repo packages (e.g., `import { ... } from "@repo/db"`)
3. Internal relative imports (e.g., `import { ... } from "../utils"` or `import { ... } from "#/hooks"`)

**Path Aliases:**
- `#/` - Maps to app root (web app)
- `@repo/` - Maps to workspace packages (`@repo/db`, `@repo/api`, `@repo/mantine-ui`)
- Relative imports with `../` are used for local directory navigation

**Auto-organization:**
- Biome's organizeImports is enabled (`source.organizeImports: on`)
- Imports are automatically sorted by Biome on save

## Error Handling

**Patterns:**
- Error handling function: `handleError(functionName, error)` in `packages/api/src/utils/handleError.ts`
- Logs error message to console.error with function context
- Always re-throws the error after logging
- Use try-catch blocks in tRPC procedures

**Example pattern in routers:**
```typescript
try {
  return await getReferenceMaterialById(ctx.db, input)
} catch (error) {
  handleError("getReferenceMaterialById", error)
  throw error
}
```

**No silent failures:**
- Never leave empty catch blocks
- Always handle or re-throw errors
- Log errors with context (function name)

## Logging

**Framework:** `console` methods (console.log, console.error)

**Patterns:**
- Use console.log for debug information
- Use console.error for errors (in handleError utility)
- Currently uses basic logging - no dedicated logging service observed
- Logging appears contextual (e.g., logging input in mutations)

**Example from routers:**
```typescript
console.log("input", input)
return await addReferenceMaterial(ctx.db, input)
```

## Comments

**When to Comment:**
- Use JSDoc for component and function documentation
- Document complex logic or non-obvious implementations
- Use `// TODO(#123):` format with Linear ticket reference
- Avoid redundant comments that restate code

**JSDoc/TSDoc:**
- Used for components with `@component`, `@description`, `@example` tags
- Used for documenting complex helper functions
- Inline comments for non-obvious business logic

**Example from codebase:**
```typescript
/**
 * Breadcrumb component with site.ts integration
 * - Uses site.ts as source of truth for labels
 * - Only leaf items (no children) are clickable links
 * - Handles dynamic parameters (UUIDs, IDs)
 * - Supports truncation and collapse for long paths
 */
```

## Function Design

**Size:**
- Components typically 50-200 lines
- Utilities small and focused (10-50 lines)
- Routers delegate to funcs, keep procedures concise

**Parameters:**
- Use destructuring for object params
- Type all parameters explicitly
- Use Zod schemas for validation in routers

**Return Values:**
- Always specify explicit return type
- Use proper types from Drizzle and Zod inference
- Return wrapped objects from queries, arrays of normalized data

**Example from routers:**
```typescript
getReferenceMaterialById: protectedProcedure
  .input(z.object({ id: referenceMaterialSchema.select.shape.id }))
  .query(async ({ ctx, input }) => {
    try {
      return await getReferenceMaterialById(ctx.db, input)
    } catch (error) {
      handleError("getReferenceMaterialById", error)
      throw error
    }
  })
```

## Module Design

**Exports:**
- Named exports preferred (e.g., `export const referenceMaterialRouter`)
- Default exports used for Next.js pages
- Re-export schemas and types alongside routers

**Barrel Files:**
- Root router index (`packages/api/src/root.ts`) aggregates all routers
- Feature folders use index files to organize sub-routers

**Example structure from packages/api:**
```typescript
// packages/api/src/root.ts aggregates:
import { aclsRolesRouter } from "./router/acls_roles.router"
import { certificationsRouter } from "./router/certifications.router"
// ... many more routers
```

## React Conventions

**Client Components:**
- Always add `"use client"` at top of file
- Use hooks: `useState`, `useEffect`, `useMemo`, `useCallback`
- Use custom hooks: `useWorkspaceRouter`, `useIsMobile`, `useAutoRefreshEmailStatus`

**Server Components:**
- No `"use client"` directive
- Async operations allowed
- Fetch with `api.*.prefetch()` for data hydration
- Wrap client components with `<HydrateClient>`

**Props and Types:**
- Define types explicitly inline or in separate `.types.ts` file
- Use union types for discriminated APIs (e.g., button href vs action)
- Component props documented with JSDoc

## Biome Configuration Rules

**Key Enforcements:**
- `useConst: error` - Must use const for variables
- `noVar: error` - var is forbidden
- `noExplicitAny: error` - No `any` type without justification
- `useOptionalChain: error` - Use optional chaining (a?.b not a && a.b)
- `useShorthandFunctionType: error` - Use `() => Type` not `Function`
- `useThrowOnlyError: error` - Only throw Error instances

**Nursery Rules (experimental):**
- `useSortedClasses: info` with safe fix - Sorts className/classList attributes (for clsx, cva, tw)

---

*Convention analysis: 2026-01-26*
