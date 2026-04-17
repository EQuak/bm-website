# Testing Patterns

**Analysis Date:** 2026-01-26

## Test Framework

**Runner:**
- Bun (`bun test`) - Primary test runner for API and business logic
- Framework: Bun's built-in test runner (TypeScript native)
- Config: No centralized test config file detected (uses Bun defaults)

**Assertion Library:**
- Custom assertion helpers (manual comparison logic)
- No dedicated assertion library dependency found
- Uses direct comparisons and manual test validation

**Run Commands:**
```bash
bun test                    # Run all tests via Bun
cd packages/api && bun test # Test API package
bun src/funcs/hr/conversion-logic/__tests__/conversion.test.ts  # Run specific test
```

## Test File Organization

**Location:**
- Co-located with source code: `__tests__` directory
- Example: `packages/api/src/funcs/hr/conversion-logic/__tests__/conversion.test.ts`
- Test files stored in `__tests__` subdirectory of feature being tested

**Naming:**
- Pattern: `*.test.ts` (not `.spec.ts`)
- Full path example: `conversion.test.ts` for conversion logic

**Structure:**
```
packages/api/src/funcs/hr/conversion-logic/
├── index.ts              # Core implementation
├── types.ts              # Type definitions
└── __tests__/
    ├── conversion.test.ts # Main test file
    └── fixtures/         # Test data
        ├── short-qb-ordered.csv
        └── short-wd-ordered-converted.csv
```

## Test Structure

**Suite Organization:**
The conversion test in `packages/api/src/funcs/hr/conversion-logic/__tests__/conversion.test.ts` demonstrates the pattern:

```typescript
/**
 * Regression Test: QB to Workday Conversion
 *
 * Validates conversion produces exact same output as validated ground truth.
 * Also validates XLSX format (worksheet name, header rows, structure).
 *
 * Ground Truth: fixtures/short-qb-ordered.csv -> fixtures/short-wd-ordered-converted.csv
 * Run: cd packages/api && bun test
 */

// Single entry point - runs comprehensive test
async function runTest(): Promise<boolean> {
  // Setup
  // Execution
  // Validation
  // Reporting
}

runTest()
  .then((passed) => {
    process.exit(passed ? 0 : 1)
  })
  .catch((error) => {
    console.error(`Error:`, error)
    process.exit(1)
  })
```

**Patterns:**
- Test files are executable TypeScript scripts with `#!/usr/bin/env bun` shebang
- Single main function (`runTest`) wraps entire test logic
- Tests use fixture files for ground truth data
- Console output for test reporting (colored output with ANSI codes)
- Exit codes indicate pass (0) or fail (1)

## Mocking

**Framework:**
- No dedicated mocking library detected
- Manual implementation of test fixtures and data structures

**Patterns:**
Test data loading and parsing pattern from conversion test:
```typescript
// Parse expected data from fixture CSV
const expectedCsv = fs.readFileSync(expectedPath, "utf-8")
const expectedRows = parseExpectedCsv(expectedCsv)

// Parse actual output from XLSX
const xlsxBuffer = await generateXLSX(transformResult.entries)
const xlsxData = await extractXlsxData(xlsxBuffer)

// Compare structures
const result = compareOutputs(expectedRows, xlsxData)
```

**What to Mock:**
- File system operations (use fs for test fixtures)
- External format parsing (CSV, XLSX)
- Data transformation results

**What NOT to Mock:**
- Core business logic (test real behavior)
- Database operations (use test databases or fixtures)
- Format validation (test actual output format)

## Fixtures and Factories

**Test Data:**
```typescript
const parseExpectedCsv = (csvContent: string): ParsedWorkdayRow[] => {
  const allRows: string[][] = parse(csvContent, {
    skip_empty_lines: false,
    relax_column_count: true
  })

  const headers = allRows[4]?.map((h) => h.trim()) ?? []
  // Parse headers and map to rows

  const parsed: ParsedWorkdayRow[] = []
  for (let i = WD_DATA_START_ROW - 1; i < allRows.length; i++) {
    // Build test data structures
  }

  return parsed
}
```

**Location:**
- Fixtures stored in `__tests__/fixtures/` subdirectory
- Example: `short-qb-ordered.csv`, `short-wd-ordered-converted.csv`
- Ground truth data serves as regression test baseline

## Coverage

**Requirements:**
- No coverage enforcement detected
- Coverage measurement not configured in package.json or tooling

**View Coverage:**
- No standard coverage command found
- Coverage would need to be added via configuration

## Test Types

**Unit Tests:**
- Scope: Individual functions and transformations
- Approach: Direct function invocation with test inputs
- Example: Parsing QB CSV into internal format, transformation functions

**Integration Tests:**
- Scope: End-to-end data pipeline (QB → Transform → Workday format → XLSX)
- Approach: Regression testing against ground truth files
- Validates full format compliance (worksheet names, header structure, data accuracy)
- Example: `conversion.test.ts` validates CSV parse → transform → XLSX generation → format validation

**E2E Tests:**
- Framework: Playwright (declared in package.json but not active in codebase)
- Status: Not currently implemented or in use
- Would test browser interactions and full application flow

## Common Patterns

**Async Testing:**
```typescript
async function runTest(): Promise<boolean> {
  // Load files
  const inputCsv = fs.readFileSync(inputPath, "utf-8")

  // Execute operations
  const parseResult = parseQuickBooksCsvString(inputCsv)
  const transformResult = transformEntries(parseResult.entries)
  const workdayRows = transformToWorkdayRows(transformResult.entries)

  // Generate output
  const xlsxBuffer = await generateXLSX(transformResult.entries)

  // Validate
  const xlsxValidation = await validateXlsxFormat(xlsxBuffer)

  return allPassed
}
```

**Error Testing:**
```typescript
// File existence validation
if (!fs.existsSync(inputPath)) {
  console.log(`${COLORS.red}Input file not found: ${inputPath}${COLORS.reset}`)
  return false
}

// Format validation
const xlsxValidation = await validateXlsxFormat(xlsxBuffer)
if (!xlsxValidation.passed) {
  console.log(`${COLORS.red}XLSX format errors:${COLORS.reset}`)
  for (const err of xlsxValidation.errors) {
    console.log(`${COLORS.red}- ${err}${COLORS.reset}`)
  }
}
```

## Test Reporting

**Output Format:**
- Colored ANSI output for terminal readability
- Summary statistics: expected rows, actual rows, perfect matches, mismatches
- Detailed mismatch reporting with sample differences (first 5)
- Visual indicators: Green (pass), Red (fail), Yellow (warnings)

**Example output structure:**
```
═══════════════════════════════════════════════════════════════════
║ QB -> Workday Conversion Regression Test                       ║
═══════════════════════════════════════════════════════════════════

Data Comparison:
   Expected rows:      100
   Actual rows:        100
   Perfect matches:     98
   Missing in actual:     2

XLSX Format:
   Worksheet name:   Valid
   Header structure: Valid

First 5 differences:
├─────────────────────────────────────────────────
│ Key: EMP123|2024-01-15 08:00:00
│ Field: Time Entry Code
│ Expected: "REG"
│ Actual:   "OVR"
└─────────────────────────────────────────────────
```

## Current Test Coverage

**Tested Areas:**
- QB to Workday CSV conversion logic
- Data transformation and field mapping
- XLSX generation and format validation
- Field-level comparison and mismatch detection

**Untested Areas:**
- Database integration tests
- API endpoint testing
- React component rendering
- UI interaction testing
- Authentication and authorization
- Error handling edge cases
- Performance and load testing

## Testing Best Practices Observed

1. **Ground Truth Testing:** Use validated reference data as regression baseline
2. **Format Validation:** Test structural compliance alongside data accuracy
3. **Detailed Reporting:** Provide actionable error messages with context
4. **File-Based Testing:** Use CSV/XLSX fixtures for complex data structures
5. **Exit Codes:** Proper exit codes for CI/CD integration
6. **Async Patterns:** Proper async/await for file I/O and async operations

---

*Testing analysis: 2026-01-26*
