# Core structure

The `core` folder contains fundamental elements of the platform that are not specific to any feature.

## Folder Structure

```
src/core/
├── components/           # Base platform components
│   ├── custom-table/    # Custom table implementation
│   ├── toggle-button/   # Toggle button components
│   ├── top-page-wrapper/# Page wrapper components
│   ├── DropZone.tsx    # File upload component
│   ├── LabelTitle.tsx  # Label with title component
│   ├── LoaderPage.tsx  # Page loading component
│   ├── LoaderSkeleton.tsx # Skeleton loading component
│   ├── PDFViewer.tsx   # PDF viewer component
│   └── WorkspaceLink.tsx # Workspace navigation component
├── config/             # Global configurations
│   ├── routes.ts      # Route management
│   ├── site.ts        # Site navigation and metadata
│   └── storage.ts     # Storage configurations
├── context/           # React contexts
│   ├── rbac/         # Role-based access control
│   └── AppContext.tsx # Main application context
```

## Key Components

### 1. Core Components

Reusable UI components with specific functionality:

```typescript
// Example: DropZone.tsx
export function DropZoneComponent(props: DropZoneProps) {
  return (
    <Dropzone
      maxSize={props.maxSizeMB ? props.maxSizeMB * 1024 * 2 : 1024 * 1024 * 2}
      accept={props.onlyImage ? IMAGE_MIME_TYPE : props.accept}
    >
      {/* Component content */}
    </Dropzone>
  )
}
```

### 2. Configuration

Global application settings:

```typescript
// routes.ts
export const DEFAULT_ROUTE_NAME = "app"
export const DEFAULT_ROUTE_PATH = `/${DEFAULT_ROUTE_NAME}`

// storage.ts
export const DEFAULT_IMAGE_MAX_SIZE = 1024 * 1024 * 5 // 5mb
export const DEFAULT_ITEMS_IMAGES_PUBLIC_BUCKET = "items_images"
```

### 3. Context Management

Application state and authentication:

```typescript
// AppContext.tsx
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile] = api.profiles.getProfileByUserLogged.useSuspenseQuery()

  const value = {
    profile: profile!,
    isBetaUser: !!profile?.preferences?.app.beta_features
  }

  return (
    <AppContext.Provider value={value}>
      <AbilityProvider>{children}</AbilityProvider>
    </AppContext.Provider>
  )
}
```

## Role-Based Access Control (RBAC)

The RBAC system provides permission management:

```typescript
// ability.ts
export const usuarioAbility = ({ acl }: { acl?: RBAC }) => {
  return defineAbility<MongoAbility<[RBAC_Actions, RbacPermissions]>>(can => {
    if (acl?.role === "admin" || acl?.role === "root") {
      can("manage", "all")
    } else {
      acl?.permissions.forEach(permission => {
        permission.actions.forEach(action => {
          can(action, permission.permission)
        })
      })
    }
    can("read", "dashboard")
    can("read", "general")
  })
}
```

## Best Practices

1. **Component Organization**

   - Components should be reusable and well-documented
   - Use TypeScript for type safety
   - Implement proper prop validation
   - Keep components focused and maintainable

2. **Configuration Management**

   - Centralize configuration in the config folder
   - Use constants for repeated values
   - Implement type-safe configurations
   - Document configuration options

3. **Context Usage**

   - Keep contexts focused on specific concerns
   - Provide proper error handling
   - Implement proper TypeScript types
   - Use hooks for accessing context

4. **RBAC Implementation**

   - Define clear permission structures
   - Implement role hierarchies
   - Use TypeScript for type safety
   - Provide proper error handling

5. **Routing**

   - Implement consistent route handling
   - Use proper route normalization
   - Handle workspace-specific routing
   - Implement proper navigation guards

6. **Error Handling**

   - Implement proper error boundaries
   - Provide meaningful error messages
   - Handle loading states appropriately
   - Implement proper fallbacks

## Usage Examples

### 1. Using WorkspaceLink

```typescript
<WorkspaceLink href="/inventory/items">
  View Items
</WorkspaceLink>
```

### 2. Implementing RBAC

```typescript
function ProtectedComponent() {
  const ability = useRBAC()

  if (ability.can("read", "inventory")) {
    return <InventoryView />
  }

  return null
}
```

### 3. Using Top Page Wrapper

```typescript
<TopPageWrapper
  pageTitle="Inventory Items"
  primaryActions={[
    {
      label: "Add Item",
      href: "/inventory/items/create",
      workspaceHref: true
    }
  ]}
>
  {/* Page content */}
</TopPageWrapper>
```

This structure ensures:

- Consistent component implementation
- Type-safe development
- Proper access control
- Maintainable configuration
- Clear navigation patterns
