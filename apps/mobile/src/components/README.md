# Mobile App Loading Components

This document provides guidance on using the shared loading spinner components throughout the mobile application.

## Available Components

### 1. LoadingSpinner
Basic animated loading spinner component.

```tsx
import { LoadingSpinner } from '../components'

// Basic usage
<LoadingSpinner />

// With custom size and color
<LoadingSpinner size={32} color="#0EA5E9" />
```

**Props:**
- `size?: number` - Size of the spinner (default: 24)
- `color?: string` - Color of the spinner (default: colors.primary)
- `style?: ViewStyle` - Additional styles for the container

### 2. LoadingOverlay
Full-screen loading overlay with optional message.

```tsx
import { LoadingOverlay } from '../components'

// Basic overlay
<LoadingOverlay visible={isLoading} />

// With message
<LoadingOverlay 
  visible={isLoading} 
  message="Loading your data..." 
  color={colors.secondary}
/>

// Transparent overlay
<LoadingOverlay 
  visible={isLoading} 
  message="Processing..." 
  transparent 
/>
```

**Props:**
- `visible: boolean` - Whether the overlay is visible
- `message?: string` - Optional loading message to display
- `color?: string` - Color of the spinner (default: colors.primary)
- `transparent?: boolean` - Whether the overlay background is transparent (default: false)

### 3. InlineLoading
Inline loading component for smaller UI elements.

```tsx
import { InlineLoading } from '../components'

// Basic inline loading
<InlineLoading message="Loading..." />

// Custom styling
<InlineLoading 
  message="Fetching data..." 
  size={20} 
  color={colors.success}
  textStyle={{ fontWeight: 'bold' }}
/>
```

**Props:**
- `message?: string` - Loading message to display (default: 'Loading...')
- `size?: number` - Size of the spinner (default: 16)
- `color?: string` - Color of the spinner (default: colors.primary)
- `style?: ViewStyle` - Additional styles for the container
- `textStyle?: TextStyle` - Additional styles for the text

### 4. PulsingDots
Alternative loading animation with pulsing dots.

```tsx
import { PulsingDots } from '../components'

// Basic pulsing dots
<PulsingDots />

// With custom color
<PulsingDots color={colors.warning} />
```

**Props:**
- `color?: string` - Color of the dots (default: colors.primary)
- `style?: ViewStyle` - Additional styles for the container

## Usage Examples

### Screen Loading States

```tsx
// In a screen component
import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { LoadingOverlay, InlineLoading } from '../components'
import { api } from '../trpc/react'

export const EmployeesScreen: React.FC = () => {
  const { data: employees, isLoading } = api.employees.getAll.useQuery()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <InlineLoading message="Loading employees..." />
      </View>
    )
  }

  return (
    <View>
      {/* Your screen content */}
    </View>
  )
}
```

### Form Submission Loading

```tsx
// In a form component
import React, { useState } from 'react'
import { Button } from 'react-native'
import { LoadingOverlay } from '../components'

export const CreateEmployeeForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // API call
      await submitEmployee(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button title="Save Employee" onPress={handleSubmit} />
      <LoadingOverlay 
        visible={isSubmitting} 
        message="Saving employee..." 
      />
    </>
  )
}
```

### Card Loading States

```tsx
// In a card component
import React from 'react'
import { View, Text } from 'react-native'
import { LoadingSpinner } from '../components'

export const ProjectCard: React.FC<{ loading?: boolean }> = ({ loading }) => {
  if (loading) {
    return (
      <View style={styles.card}>
        <LoadingSpinner size={24} />
        <Text>Loading project...</Text>
      </View>
    )
  }

  return (
    <View style={styles.card}>
      {/* Card content */}
    </View>
  )
}
```

### List Item Loading

```tsx
// In a list component
import React from 'react'
import { FlatList } from 'react-native'
import { PulsingDots } from '../components'

export const EmployeesList: React.FC = () => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } = 
    api.employees.getInfinite.useInfiniteQuery()

  const renderFooter = () => {
    if (!isFetchingNextPage) return null
    return <PulsingDots color={colors.secondary} />
  }

  return (
    <FlatList
      data={data?.pages.flatMap(page => page.items) ?? []}
      renderItem={renderItem}
      ListFooterComponent={renderFooter}
      onEndReached={fetchNextPage}
    />
  )
}
```

## Best Practices

1. **Choose the Right Component:**
   - Use `LoadingOverlay` for full-screen loading states
   - Use `InlineLoading` for section-specific loading
   - Use `LoadingSpinner` for minimal loading indicators
   - Use `PulsingDots` for subtle, ongoing processes

2. **Performance:**
   - Components use `react-native-reanimated` for smooth animations
   - Animations run on the native thread for better performance
   - Components are lightweight and optimized for mobile

3. **Accessibility:**
   - Loading messages provide context for screen readers
   - Color contrast follows accessibility guidelines
   - Components work well with React Native accessibility props

4. **Consistency:**
   - Use the app's color scheme from the styles system
   - Maintain consistent sizing across similar UI elements
   - Follow the existing design patterns in the app

5. **User Experience:**
   - Always provide feedback for operations longer than 1 second
   - Use appropriate loading messages that describe what's happening
   - Consider timeout states for long-running operations

## Integration with tRPC

These components work seamlessly with tRPC queries and mutations:

```tsx
import { api } from '../trpc/react'
import { LoadingOverlay } from '../components'

// Query loading state
const { data, isLoading } = api.projects.getAll.useQuery()

// Mutation loading state
const createProject = api.projects.create.useMutation()

return (
  <>
    {/* Your UI */}
    <LoadingOverlay 
      visible={isLoading || createProject.isLoading} 
      message={isLoading ? "Loading projects..." : "Creating project..."} 
    />
  </>
)
```

## Color Reference

The components use colors from the app's design system:

- `colors.primary`: #393939 (Default spinner color)
- `colors.secondary`: #0EA5E9 (Blue accent)
- `colors.success`: #16A34A (Green)
- `colors.warning`: #F59E0B (Orange)
- `colors.danger`: #DC2626 (Red)
