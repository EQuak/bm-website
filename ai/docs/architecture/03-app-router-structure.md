# App Router structure

The project uses Next.js App Router with a carefully organized structure to handle different application areas and states.

## Root Structure

```
web/src/app/
├── (application)/     # Main application routes
│   └── app/          # Protected application routes
│       ├── (beta)/   # Beta features group
│       └── (stable)/ # Stable features
├── (auth)/           # Authentication related routes
└── layout.tsx        # Root layout
```

## Route Groups

The project uses route groups (folders wrapped in parentheses) to organize routes without affecting the URL structure:

### 1. Application Group `(application)`

Main application container with authentication and layout:

```typescript
// Example of protected route structure
web/src/app/(application)/app/(inventory)/inventory/
├── _components/      # Route-specific components
├── transactions/     # Sub-route
│   └── _components/ # Transaction-specific components
└── page.tsx         # Main inventory page
```

### 2. Beta Group `(beta)`

Features under development or testing:

```typescript
web/src/app/(application)/app/(beta)/
├── beta_/
│   ├── (company-directory)/  # Beta company directory feature
│   ├── (notifications)/      # Beta notifications system
│   └── (job-applications)/   # Beta job applications module
```

### 3. Auth Group `(auth)`

Authentication-related routes:

```typescript
web/src/app/(auth)/
├── login/
├── register/
└── forgot-password/
```

## Page Organization

### 1. Route Components

Each route follows a consistent structure:

```typescript
// web/src/app/(application)/app/(beta)/beta_/(notifications)/email-notifications/[...mode]/page.tsx
export default async function EmailNotificationsPage({
  params
}: {
  params: Promise<{
    mode: ["create" | "list"]
  }>
}) {
  const mode = (await params).mode[0]

  return (
    <HydrateClient>
      {mode === "list" ? <EmailNotificationsList /> : <EmailNotificationsForm mode={mode} />}
    </HydrateClient>
  )
}
```

### 2. Route-Specific Components

Components are organized in `_components` folders near their routes:

```typescript
email-notifications/
├── [...mode]/
│   ├── _components/
│   │   ├── form/              # Form-related components
│   │   ├── list/              # List-related components
│   │   └── CustomMessageInput.tsx
│   └── page.tsx
```

## Route Patterns

### 1. Dynamic Routes

Using Next.js dynamic route patterns:

```typescript
// Catch-all route with optional segments
;[...mode] /
  // Single dynamic segment
  page.tsx[id] / // Matches /create, /edit/123, etc.
  page.tsx // Matches /123, /456, etc.
```

### 2. Route Groups

Groups are used to:

- Organize code without affecting URL structure
- Share layouts between related routes
- Create multiple root layouts

```typescript
(beta)/                // Beta features group
(application)/         // Main application group
(auth)/                // Authentication group
```

## Best Practices

1. **Route Organization**

   - Use route groups for logical separation
   - Keep components close to their routes
   - Follow consistent naming conventions
   - Use dynamic routes appropriately

2. **Component Structure**

   - Place route-specific components in `_components`
   - Share common components through the core
   - Use proper component naming conventions
   - Implement proper type safety

3. **Layout Management**

   - Use layout.tsx for shared UI
   - Implement nested layouts when needed
   - Keep layouts focused and maintainable
   - Handle loading states appropriately

4. **Beta Features**

   - Place beta features in dedicated group
   - Implement feature flags when needed
   - Maintain parallel stable versions
   - Plan migration paths to stable

This structure ensures:

- Clear route organization
- Proper code separation
- Maintainable codebase
- Scalable architecture
- Easy feature management
