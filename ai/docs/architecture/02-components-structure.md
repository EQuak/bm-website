# Component structure

The components in this project are organized across different levels to maximize reusability and maintainability.

## Component Hierarchy

```
project/
├── packages/
│   └── mantine-ui/            # Shared UI components package
│       └── src/components/
│           ├── password-meter.tsx
│           ├── radio-select.tsx
│           ├── select.tsx
│           └── theme-toggle.tsx
├── web/
    ├── src/
        ├── components/        # Project-wide components
        └── app/              # Route-specific components
            └── (route)/
                └── _components/  # Page-specific components
```

## Component Types

### 1. Shared UI Components (packages/mantine-ui)

Base components that can be shared across multiple applications:

```typescript
// packages/mantine-ui/src/components/password-meter.tsx
export const PasswordMeter: FC<PasswordStrengthProps> = ({
  requirements: customRequirements,
  ...props
}) => {
  const { requirements, minLength } = getRequirements(customRequirements)
  // Component implementation...
}
```

### 2. Project Components (web/src/components)

Components specific to the web application but reusable across different pages:

```typescript
// web/src/components/data-table/DataTable.tsx
export function DataTable<T>({ columns, data }: DataTableProps<T>) {
  return (
    <MantineTable
      columns={columns}
      data={data}
      // Component implementation...
    />
  )
}
```

### 3. Route Components (\_components)

Components specific to a particular route/page:

```typescript
// web/src/app/inventory/items/_components/ItemForm.tsx
export function ItemForm({ initialData }: ItemFormProps) {
  return (
    <form>
      // Form implementation specific to inventory items...
    </form>
  )
}
```

## Best Practices

1. **Package Components (@repo/mantine-ui)**

   - Keep components generic and configurable
   - Implement proper TypeScript types
   - Maintain consistent styling with Mantine + Tailwind
   - Document component props and usage
   - Export through index files

2. **Project Components (web/components)**

   - Build on top of package components
   - Implement business-specific logic
   - Keep components focused and reusable
   - Use proper type imports from packages

3. **Route Components (\_components)**

   - Keep close to their respective routes
   - Handle page-specific logic
   - Compose using project and package components
   - Focus on specific use cases

4. **Styling Approach**

   - Use Mantine components as base
   - Extend with Tailwind when needed
   - Maintain consistent theme variables
   - Follow responsive design patterns

## Usage Examples

### 1. Using Package Components

```typescript
import { PasswordMeter } from "@repo/mantine-ui"

function SignupForm() {
  return (
    <PasswordMeter
      requirements={{
        number: true,
        upper: true,
        length: 8
      }}
      label="Password"
    />
  )
}
```

### 2. Composing Components

```typescript
import { Select } from "@repo/mantine-ui"
import { FormWrapper } from "@/components/form"

function InventoryForm() {
  return (
    <FormWrapper>
      <Select
        label="Status"
        value={status}
        onChange={handleStatusChange}
      />
    </FormWrapper>
  )
}
```

### 3. Route-Specific Components

```typescript
// web/src/app/inventory/transactions/_components/
export function TransactionForm() {
  return (
    <form>
      <LocationSelector />
      <ItemsTable />
      <TransactionSummary />
    </form>
  )
}
```

## Component Guidelines

1. **Location Decision**

   - Is it generic and reusable across apps? → packages/mantine-ui
   - Is it project-wide but specific? → web/components
   - Is it page-specific? → \_components folder

2. **Naming Conventions**

   - Package components: Generic names (Select, Button)
   - Project components: Feature-prefixed (DataTable, UserCard)
   - Route components: Page-specific (TransactionForm)

3. **File Organization**
   - Use index files for exports
   - Group related components
   - Keep styles close to components
   - Maintain clear folder structure

This structure ensures:

- Clear component hierarchy
- Proper code sharing
- Maintainable codebase
- Type safety
- Consistent styling
