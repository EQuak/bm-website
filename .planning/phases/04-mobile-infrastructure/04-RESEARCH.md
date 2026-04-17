# Phase 4: Mobile Infrastructure - Research

**Researched:** 2026-01-27
**Domain:** React Native / Expo / Mobile App Infrastructure
**Confidence:** HIGH

## Summary

This research investigated the mobile infrastructure stack for a React Native app built with Expo SDK 54, Expo Router 6, and React Native 0.81. The goal is to validate and update the mobile app infrastructure for iOS 26 compatibility and ensure it's ready for beta deployment.

The project already uses Expo SDK 54 (~54.0.22) and Expo Router 6 (^6.0.14), both of which provide full iOS 26 support. The migration from React Navigation to Expo Router has been completed. The standard approach for Phase 4 is to validate the existing infrastructure, update dependencies to latest stable versions, clean up any stale code, verify simulator functionality, and ensure proper configuration for Google Play testing.

Key findings indicate that Expo SDK 54 provides comprehensive iOS 26 support with Xcode 26, React Native 0.81 includes significant iOS build performance improvements, and the app structure follows Expo Router best practices with proper file-based routing.

**Primary recommendation:** Update to latest patch versions within Expo SDK 54, verify monorepo configuration with pnpm workspaces, clean up any unused dependencies, test on both iOS and Android simulators, and configure EAS Build profiles for development and beta testing.

## Standard Stack

The established libraries/tools for Expo-based React Native mobile apps in 2026:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| expo | ~54.0.31 | Core Expo SDK | Latest stable with iOS 26 support, integrated build and deployment tooling |
| expo-router | ^6.0.21 | File-based routing | Official Expo navigation solution, replaces React Navigation, native iOS features |
| react-native | 0.81.5 | Core framework | Bundled with Expo SDK 54, includes Android 16 and iOS 26 support |
| react | 19.1.0 | UI framework | Latest stable React, required for React Native 0.81 |
| @tanstack/react-query | ^5.50.0 | Data fetching | Standard for server state management in React Native, works with tRPC |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| expo-dev-client | latest | Development builds | Custom native code or third-party native modules |
| nativewind | ^4.2.1 | Styling | Tailwind CSS for React Native, rapid UI development |
| react-native-reanimated | ~4.1.2 | Animations | High-performance animations, gestures |
| react-native-gesture-handler | ~2.28.0 | Touch interactions | Required by Expo Router and Reanimated |
| @trpc/client | catalog:trpc | API client | Type-safe API calls to backend |
| expo-status-bar | ~3.0.8 | Status bar | Programmatic status bar control (required, not in app.json) |

### Development Tools
| Tool | Purpose | When to Use |
|------|---------|-------------|
| EAS CLI | Build and deployment | Production builds, TestFlight, Google Play |
| expo-doctor | Dependency validation | Before any deployment, after upgrades |
| Expo Orbit | Simulator management | Local development, installing builds |
| Detox | E2E testing | Automated testing on simulators/devices |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Expo Router | React Navigation | More mature ecosystem but manual configuration, no file-based routing |
| EAS Build | Local builds | Free but slower, manual signing, no CI/CD integration |
| Expo Managed | Bare React Native | Full native control but lose Expo tooling, harder upgrades |

**Installation:**
```bash
# Update to latest SDK 54 versions
cd apps/mobile
npx expo install expo@latest expo-router@latest --fix

# Verify dependencies
npx expo-doctor

# Install EAS CLI globally
npm install -g eas-cli

# Initialize EAS (if not already done)
eas init
```

## Architecture Patterns

### Monorepo Configuration with pnpm

Current setup uses pnpm workspaces with Turborepo. Critical configuration required:

**Root `.npmrc` configuration:**
```
node-linker=hoisted
```

This is **MANDATORY** for React Native in monorepos. React Native's Metro bundler expects all dependencies in a single `node_modules` directory. Without hoisting, you'll encounter module resolution errors.

**Why hoisting is required:**
- React Native's build system expects flat node_modules structure
- Metro bundler cannot resolve dependencies from workspace packages
- Duplicate React Native versions will cause runtime errors
- Selective hoisting causes unpredictable issues with RN version changes

### Recommended Project Structure (Already Implemented)

```
apps/mobile/
├── src/
│   ├── app/                           # Expo Router routes (file-based)
│   │   ├── (application)/             # Authenticated routes
│   │   │   └── app/                   # Main app routes
│   │   │       ├── _layout.tsx        # Drawer navigation
│   │   │       └── [feature]/         # Feature folders
│   │   │           ├── _layout.tsx    # Stack navigation + drawer title
│   │   │           ├── list.tsx       # Main list screen
│   │   │           └── details/[id].tsx  # Modal detail screen
│   │   ├── (auth)/                    # Unauthenticated routes
│   │   ├── _layout.tsx                # Root layout
│   │   └── index.tsx                  # Entry redirect
│   ├── views/                         # Screen components (business logic)
│   │   └── [feature]/
│   │       ├── FeatureScreen.tsx      # List screen logic
│   │       ├── DetailScreen.tsx       # Detail screen logic
│   │       └── _components/           # Feature-specific components
│   │           ├── useFeature.tsx     # Centralized data hook
│   │           └── FeatureCard.tsx    # Reusable cards
│   ├── components/                    # Shared UI components
│   ├── trpc/                          # tRPC client
│   └── utils/                         # Utilities
├── package.json
└── babel.config.js
```

**Key principles:**
- `/app/` contains ONLY routing and layout configuration
- `/views/` contains screen logic and components
- Centralized data hooks in `_components/useFeature.tsx`
- Modal navigation uses dynamic routes `[id].tsx`
- No state-based modals (use route-based navigation)

### Pattern 1: Centralized Data Hooks

**What:** Single hook per feature that manages API calls and data access
**When to use:** Any feature with list + detail views

**Example:**
```typescript
// Source: Project's existing pattern
// /src/views/company-directory/_components/useCompanyDirectory.tsx

import { api } from "#/trpc/react"
import { useCallback } from "react"

export const useCompanyDirectory = () => {
  const {
    data: companyDirectoryList,
    isLoading,
    error,
    refetch,
    isRefetching
  } = api.externalUsers.getCompanyDirectoryResults.useQuery(undefined, {
    gcTime: 1000 * 60 * 60 * 24 * 1,  // Cache for 1 day
    staleTime: 1000 * 60 * 10          // Fresh for 10 minutes
  })

  // Helper to get individual item by ID
  const getEmployeeById = useCallback(
    (id: string) => {
      return companyDirectoryList?.find((employee) => employee.id === id)
    },
    [companyDirectoryList]
  )

  return {
    companyDirectoryList,
    isLoading,
    error,
    refetch,
    isRefetching,
    getEmployeeById  // Detail screens use this
  }
}
```

**Benefits:**
- Single API call for both list and detail screens
- React Query handles caching automatically
- Both screens stay in sync
- Type-safe throughout

### Pattern 2: Route-Based Modal Navigation

**What:** Use file system routes for modals instead of state-based modals
**When to use:** Detail views, overlays, any "modal" presentation

**Example:**
```typescript
// Source: Expo Router documentation + project patterns

// File: /app/(application)/app/feature/_layout.tsx
import { Stack } from "expo-router"
import { Drawer } from "expo-router/drawer"

export default function FeatureLayout() {
  return (
    <>
      <Drawer.Screen options={{ title: "Feature Name" }} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="list" options={{ headerShown: false }} />
        <Stack.Screen
          name="details/[id]"
          options={{
            presentation: "modal",  // Slides up from bottom
            headerShown: true       // Modal has its own header
          }}
        />
      </Stack>
    </>
  )
}

// File: /views/feature/FeatureScreen.tsx (List)
const handlePress = (itemId: string) => {
  router.push(`/app/feature/details/${itemId}`)  // Pass only ID
}

// File: /views/feature/DetailScreen.tsx (Modal)
const { id } = useLocalSearchParams()  // Get from URL
const { getItemById } = useFeature()   // Shared hook
const item = getItemById(id as string) // From cache
```

### Pattern 3: Navigation Anchoring for Deep Links

**What:** Anchor modals to their parent stack to preserve navigation context
**When to use:** Any modal that can be accessed via deep link

**Configuration:**
```typescript
// File: /app/(application)/app/feature/details/[id].tsx
import { Stack } from "expo-router"

export default function DetailScreen() {
  return (
    <>
      {/* Anchor ensures parent screen exists */}
      <Stack.Screen options={{ presentation: "modal" }} />
      {/* Screen content */}
    </>
  )
}
```

**Why:** Without anchoring, deep-linking directly to a modal will have no parent screen, causing navigation issues.

### Anti-Patterns to Avoid

- **State-based modals:** Don't use `useState` for modal visibility with full objects in state. Use routes.
- **Passing complex objects in URLs:** Only pass IDs or simple strings. Use centralized hooks to retrieve data.
- **Duplicate Babel plugins:** Don't add `react-native-worklets/plugin` separately if using Reanimated (it's included).
- **Manual status bar config in app.json:** Use `expo-status-bar` package instead (required in SDK 54).
- **Selective dependency hoisting:** Always use `node-linker=hoisted` in monorepos with React Native.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Native navigation | Custom stack/modal system | Expo Router | Deep linking, web support, type-safe routes, native transitions |
| Native modules | Custom bridges | Expo SDK modules | Maintained, documented, iOS 26 compatible |
| Build system | Manual Xcode/Android Studio | EAS Build | Automatic signing, CI/CD, no local setup needed |
| File uploads | Custom multipart implementation | expo-image-picker + expo-document-picker | Native UI, permissions handling, type validation |
| Status bar styling | app.json configuration | expo-status-bar package | Required in SDK 54, programmatic control |
| Authentication flow | Custom navigation guards | Expo Router groups | File-based auth boundaries, type-safe redirects |
| Dependency validation | Manual package.json checks | expo-doctor | Detects version conflicts, compatibility issues |
| Simulator management | Manual Xcode/Android Studio | Expo Orbit | One-click install, no IDE needed |

**Key insight:** Expo has built robust solutions for mobile app common problems. Custom implementations will have compatibility issues with iOS updates, incomplete edge case handling, and harder maintenance. Always check Expo SDK for a module before implementing from scratch.

## Common Pitfalls

### Pitfall 1: Babel Plugin Duplication

**What goes wrong:** Build fails with "Duplicate plugin/preset detected" error
**Why it happens:** `react-native-worklets/plugin` is already included in `react-native-reanimated/plugin`. Adding both causes a conflict.
**How to avoid:**
```javascript
// ❌ WRONG
module.exports = {
  plugins: [
    'react-native-reanimated/plugin',
    'react-native-worklets/plugin'  // DUPLICATE!
  ]
}

// ✅ CORRECT (current setup is correct)
module.exports = {
  plugins: [
    'react-native-worklets/plugin'  // Only this if using worklets directly
  ]
}
```
**Warning signs:** "Duplicate plugin" error during build, Babel configuration errors

### Pitfall 2: statusBar Configuration in app.json

**What goes wrong:** Build fails with schema validation error
**Why it happens:** Expo SDK 54 removed support for `statusBar` field in app.json root and Android config
**How to avoid:**
```json
// ❌ WRONG - Remove from app.json
{
  "expo": {
    "statusBar": { ... }  // NOT SUPPORTED in SDK 54
  }
}

// ✅ CORRECT - Use expo-status-bar package
import { StatusBar } from 'expo-status-bar'
<StatusBar style="auto" />
```
**Warning signs:** "statusBar field is no longer supported" error from expo-doctor

### Pitfall 3: Missing node-linker=hoisted in Monorepo

**What goes wrong:** "Unable to resolve module" errors, Metro bundler failures
**Why it happens:** React Native requires flat node_modules, pnpm uses symlinks by default
**How to avoid:**
```
# .npmrc at repository root
node-linker=hoisted
```
**Warning signs:** Module resolution errors, "Cannot find module" in Metro bundler, build succeeds but runtime crashes

### Pitfall 4: Modal Interactivity Issues on iOS

**What goes wrong:** Taps don't register in modals on physical iOS devices (works in simulator)
**Why it happens:** Known issue with Expo Router 6 modal presentation on iOS physical devices
**How to avoid:**
- Test on physical devices early, not just simulators
- Consider using `presentation: "card"` as alternative
- Add `testID` props for automation testing (helps debug)
- Check GitHub issues for Expo Router modal problems
**Warning signs:** Modal works in simulator but not on device, delayed tap response, navigation stack failures

### Pitfall 5: Edge-to-Edge Mode on Android

**What goes wrong:** Unexpected padding/layout issues on Android
**Why it happens:** Expo SDK 54 + React Native 0.81 enables edge-to-edge mode by default on Android 16
**How to avoid:**
- Use `react-native-safe-area-context` properly
- Test on Android 16 emulators
- Update layouts to respect safe areas
- Cannot be disabled (intentional design)
**Warning signs:** Content appearing under status bar, cut-off bottom navigation

### Pitfall 6: Duplicate React/React Native Versions

**What goes wrong:** Runtime crashes with cryptic "Invalid hook call" or "Cannot read property" errors
**Why it happens:** Multiple versions of React or React Native in monorepo dependencies
**How to avoid:**
- Run `npx expo-doctor` regularly
- Ensure all packages use workspace protocol: `"@repo/api": "workspace:*"`
- Keep React and React Native versions aligned across monorepo
- Use pnpm's `overrides` if needed
**Warning signs:** "Hooks can only be called inside function components" error, unexpected re-renders

## Code Examples

Verified patterns from project and official sources:

### Navigation Between Screens

```typescript
// Source: Expo Router documentation + project patterns
// List screen - navigate to detail

import { useRouter } from "expo-router"

export function ListScreen() {
  const router = useRouter()

  const handleItemPress = (id: string) => {
    // Navigate to modal detail screen
    router.push(`/app/feature/details/${id}`)
  }

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <ItemCard onPress={() => handleItemPress(item.id)} />
      )}
    />
  )
}
```

### Accessing Route Parameters

```typescript
// Source: Expo Router documentation
// Detail screen - get ID from URL

import { useLocalSearchParams, Stack } from "expo-router"

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { getItemById } = useFeature()  // Centralized hook

  const item = getItemById(id)

  if (!item) return null

  return (
    <>
      <Stack.Screen options={{ title: item.name }} />
      <View>{/* Detail content */}</View>
    </>
  )
}
```

### Development Build Configuration

```json
// Source: Expo EAS documentation
// eas.json - development and preview profiles

{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      },
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  }
}
```

### Running Expo Doctor

```bash
# Source: Expo documentation
# Validate dependencies before deployment

npx expo-doctor

# Common checks:
# - SDK version compatibility
# - Peer dependency issues
# - Deprecated configurations
# - Missing dependencies
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| React Navigation manual setup | Expo Router file-based | SDK 50+ (2024) | Simpler setup, type-safe routes, web support |
| Metro config for monorepos | Auto-configured Metro | SDK 52+ (2025) | No manual Metro config needed |
| app.json statusBar config | expo-status-bar package | SDK 54 (2025) | Programmatic control, more flexible |
| Manual dependency updates | expo install --fix | SDK 47+ (2023) | Automatic compatible versions |
| Local builds only | EAS Build first | 2023+ | Faster builds, automatic signing, CI/CD |
| SemVer packages | Unified SDK versioning | SDK 55 beta (2026) | All packages match SDK version |

**Deprecated/outdated:**
- **statusBar in app.json:** Removed in SDK 54, use expo-status-bar package
- **React Navigation stacks:** Being replaced by Expo Router in new projects
- **Legacy Architecture:** Dropped in SDK 55 beta, only New Architecture supported
- **Manual Metro configuration:** Auto-detected in SDK 52+ for monorepos
- **Bare workflow terminology:** Now called "bare React Native" vs "Expo managed"

## Open Questions

Things that couldn't be fully resolved:

1. **EAS Build Configuration**
   - What we know: Project doesn't have eas.json file yet
   - What's unclear: Build profiles needed for development, preview, production
   - Recommendation: Create eas.json with development (simulator), preview (internal), production (store) profiles

2. **Google Play Console Setup**
   - What we know: MOBIL-02 requires Google account configuration
   - What's unclear: Is Google Play Console account created? Service account key generated?
   - Recommendation: Follow Google Play setup before planning deployment tasks

3. **Existing Code Quality**
   - What we know: Migration to Expo Router is complete, no old /screens or /navigation folders
   - What's unclear: Are there broken components, missing visualizations, or stale code as mentioned in requirements?
   - Recommendation: Run the app on simulators to identify issues, use TypeScript compiler to find broken components

4. **Testing Infrastructure**
   - What we know: Project uses Vitest and Playwright (from root package.json)
   - What's unclear: Is there mobile-specific E2E testing with Detox?
   - Recommendation: Defer E2E testing setup to later phase, focus on manual testing for beta

## Sources

### Primary (HIGH confidence)
- [Expo SDK 54 Changelog](https://expo.dev/changelog/sdk-54) - SDK features and requirements
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/) - Routing patterns
- [React Native 0.81 Release](https://reactnative.dev/blog/2025/08/12/react-native-0.81) - RN features and iOS support
- [Expo Monorepo Guide](https://docs.expo.dev/guides/monorepos/) - Monorepo configuration
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/) - Build system setup
- Project files: package.json, babel.config.js, CLAUDE.md - Current configuration

### Secondary (MEDIUM confidence)
- [Expo SDK 54 iOS 26 Compatibility Article](https://medium.com/@roman_fedyskyi/building-with-expo-sdk-54-precompiles-ios-26-bdbd4dfca09e) - iOS 26 support details
- [Upgrading to Expo SDK 54 Issues](https://diko-dev99.medium.com/upgrading-to-expo-sdk-54-common-issues-and-how-to-fix-them-1b78ac6b19d3) - Common pitfalls
- [React Native pnpm Monorepo Journey](https://dev.to/heyradcode/react-native-pnpm-and-monorepos-a-dependency-hoisting-journey-5809) - Hoisting requirements
- [Expo Router v6 Announcement](https://expo.dev/blog/expo-router-v6) - New features
- [Expo Router Modal Issues](https://github.com/expo/expo/issues/36068) - Known modal problems

### Tertiary (LOW confidence)
- [Expo SDK 55 Beta Features](https://medium.com/@onix_react/whats-new-in-expo-sdk-55-6eac1553cee8) - Future direction (beta only)
- [Detox Setup 2026](https://medium.com/@svbala99/simple-step-by-step-setup-detox-for-react-native-android-e2e-testing-2026-ed497fd9d301) - Testing setup (not immediately needed)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Current versions verified from package.json, official Expo docs confirm iOS 26 support
- Architecture: HIGH - Project already follows Expo Router best practices, CLAUDE.md documents patterns
- Pitfalls: HIGH - Verified from official Expo issues, upgrade guides, and community reports
- Google Play setup: MEDIUM - General process documented, specific account status unknown
- Code cleanup needs: LOW - Mentioned in requirements but no specific broken components identified

**Research date:** 2026-01-27
**Valid until:** 2026-02-27 (30 days - Expo SDK stable, mobile infrastructure relatively stable)

**Notes:**
- Expo SDK 55 beta is available but NOT recommended for production (New Architecture only, breaking changes)
- Current SDK 54 provides full iOS 26 support, stick with SDK 54 for this phase
- Project already migrated to Expo Router, focus is validation and cleanup, not migration
- EAS Build setup required for deployment workflows
