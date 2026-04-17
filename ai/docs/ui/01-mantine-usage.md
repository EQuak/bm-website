# Using Mantine UI

The web app uses Mantine 7+ as the primary component library, integrated with Tailwind CSS for flexible and consistent styling.

## Form Management with useForm

### 1. Form Modes

#### Controlled Mode (Default)

Good for simple forms (3-4 fields):

```typescript
const form = useForm({
  initialValues: {
    email: "",
    password: ""
  },
  validate: {
    email: value => (/^\S+@\S+$/.test(value) ? null : "Invalid email")
  }
})
```

#### Uncontrolled Mode (Recommended for Complex Forms)

Better performance for larger forms:

```typescript
const form = useForm({
  mode: "uncontrolled",
  initialValues: {
    personalInfo: {
      name: "",
      email: ""
    },
    addresses: [{ street: "", city: "" }]
  }
})
```

### 2. Form State Management

Using form for both data and UI state:

```typescript
type FormType = {
  states: {
    loading: boolean
    drawer: {
      opened: boolean
    }
    selectedItem?: Item | null
  }
  data: {
    name: string
    email: string
    // ... other form fields
  }
}

const form = useForm<FormType>({
  initialValues: {
    states: {
      loading: false,
      drawer: { opened: false },
      selectedItem: null
    },
    data: {
      name: "",
      email: ""
    }
  }
})
```

### 3. Form Watching and Status

New features for better control:

```typescript
// Watch specific field changes
form.watch("email", ({ value, previousValue, touched, dirty }) => {
  console.log({ value, previousValue, touched, dirty })
})

// Track form submission state
const form = useForm({
  initialValues: { name: "" }
})

<Button
  type="submit"
  loading={form.submitting}
  onClick={form.onSubmit(async (values) => {
    // form.submitting will be true during async operation
    await submitData(values)
  })}
>
  Submit
</Button>
```

## Component Organization

### 1. Layout Components

Use semantic Mantine components for clear structure:

```typescript
<Stack gap="md">
  <Title order={2}>Dashboard</Title>

  <Group justify="space-between" align="center">
    <TextInput placeholder="Search..." />
    <Button>New Item</Button>
  </Group>

  <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
    {/* Cards */}
  </SimpleGrid>
</Stack>
```

### 2. Styling with Tailwind

```typescript
<UnstyledButton
  className="hover:bg-mtn-gray-1 flex w-full items-center gap-2
             rounded-md px-4 py-2 transition-colors"
>
  <Avatar src={user.avatar} radius="md" />
  <div className="flex-1 truncate">
    <Text size="sm" fw={500}>{user.name}</Text>
    <Text size="xs" c="dimmed">{user.email}</Text>
  </div>
</UnstyledButton>
```

## Best Practices

1. **Form Management**

   - Use uncontrolled mode for complex forms
   - Leverage form state for UI management
   - Use form.watch for field-specific effects
   - Track submission state with form.submitting

2. **Component Structure**

   - Use semantic layout components (Stack, Group)
   - Combine Mantine props with Tailwind classes
   - Keep components focused and reusable
   - Follow responsive design patterns

3. **Performance**

   - Choose appropriate form mode based on complexity
   - Use proper Mantine compound components
   - Leverage Tailwind's utility classes
   - Monitor and optimize re-renders

4. **Type Safety**

   - Define proper form types
   - Use TypeScript for component props
   - Leverage Mantine's built-in types
   - Document complex type structures

## Implementation Examples

### Complex Form with State Management

```typescript
const form = useForm<TransactionFormType>({
  validate: mtnZodResolver(mode === "create" ? createValidation : editValidation),
  initialValues: {
    states: {
      loading: false,
      drawer: { opened: false }
    },
    data: {
      // form fields
    }
  },
  enhanceGetInputProps: ({ form, field }) => ({
    readOnly: mode === "view",
    disabled: !form.initialized || form.submitting
  })
})
```

### Responsive Layout

```typescript
<Stack gap="md" className="p-4 md:p-6">
  <Group justify="space-between" wrap="nowrap">
    <TextInput
      className="flex-1"
      leftSection={<IconSearch size={16} />}
      placeholder="Search..."
    />
    <Group gap="xs" className="hidden md:flex">
      <Button variant="light">Export</Button>
      <Button>Add New</Button>
    </Group>
  </Group>

  <Card withBorder>
    <DataTable
      data={data}
      columns={columns}
    />
  </Card>
</Stack>
```

This structure ensures:

- Efficient form management
- Consistent styling
- Type-safe development
- Optimal performance
- Clear component hierarchy
