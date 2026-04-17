# Mobile App - Expo Router Migration Guide

## ⚠️ CRITICAL MIGRATION WORKFLOW

### NEVER MODIFY OLD FILES

The old navigation system (`/src/screens/` + `/src/navigation/`) must remain **UNTOUCHED** during migration.

### Migration Workflow:
1. ✅ **Copy** `/src/screens/FeatureScreen/` → `/src/views/feature/`
2. ✅ **Create** new routes in `/src/app/(application)/app/feature/`
3. ✅ **Modify ONLY** the copied files in `/src/views/`
4. ❌ **DO NOT touch** anything in `/src/screens/` or `/src/navigation/`

### Why?
- Old code serves as working reference
- Easier to compare implementations during development
- Safe rollback if needed
- Delete old structure only **after complete migration**

---

## Navigation Architecture

### Three-Layer System:

#### 1. Drawer Navigation (Main App Level)
- **Location:** `/src/app/(application)/app/_layout.tsx`
- **Purpose:** Top-level navigation between major features
- **Shows:** Sidebar menu, header logo, notifications bell
- **Used for:** Main feature navigation (Company Directory, Employees, Inventory, etc.)

#### 2. Stack Navigation (Feature Level)
- **Location:** `/src/app/(application)/app/[feature]/_layout.tsx`
- **Purpose:** Navigation within a specific feature
- **Replaces:** Old `/src/navigation/*Stack.tsx` files
- **Controls:** Screen transitions, headers, modal presentations

#### 3. Modal Presentation (Detail Views)
- **Location:** Stack screens with `presentation: "modal"`
- **Purpose:** Show detail views as overlays
- **Replaces:** State-based modals with `visible={showModal}`
- **Behavior:** Slides up from bottom, dismissible with swipe

---

## File Structure Transformation

### OLD Structure (React Navigation):
```
/src/navigation/
└── CompanyDirectoryStack.tsx          # Stack navigator definition

/src/screens/
└── CompanyDirectoryScreen/
    ├── CompanyDirectoryScreen.tsx     # Main list screen
    ├── _components/
    │   ├── CompanyDirectoryCard.tsx
    │   ├── EmployeeDetailModal.tsx    # State-based modal
    │   └── useCompanyDirectory.tsx
```

### NEW Structure (Expo Router):
```
/src/app/(application)/app/
└── company-directory/
    ├── _layout.tsx                    # Stack config + Drawer title
    ├── list.tsx                       # Main screen wrapper
    └── details/
        └── [id].tsx                   # Route-based modal

/src/views/
└── company-directory/                 # COPIED from /src/screens/
    ├── CompanyDirectoryScreen.tsx     # Modified for router
    ├── InfoModalScreen.tsx            # Converted from modal
    └── _components/
        ├── CompanyDirectoryCard.tsx   # Modified to pass ID
        └── useCompanyDirectory.tsx    # Centralized data hook
```

### Naming Conventions:
- **Folders:** `kebab-case` (company-directory, not CompanyDirectory)
- **Files in `/app/`:** Simple names (list.tsx, not CompanyDirectoryList.tsx)
- **Files in `/views/`:** Keep descriptive names (CompanyDirectoryScreen.tsx)
- **Dynamic routes:** Must match exactly - `[id].tsx` → accessible at `/details/123`

---

## Centralized Data Hooks Pattern

### Problem with Dynamic Routes:
You **cannot** pass complex objects through URL parameters.

### OLD Way (React Navigation):
```tsx
// List Screen - passing full object
const handlePress = (employee: Employee) => {
  navigation.navigate('EmployeeDetail', { 
    employee: employee  // ❌ Full object passed through params
  })
}

// Detail Screen - receiving object
function DetailScreen({ route }) {
  const { employee } = route.params  // Object from params
  return <View>{employee.name}</View>
}
```

### NEW Way (Expo Router):

#### Step 1: Create centralized hook
**File:** `/src/views/company-directory/_components/useCompanyDirectory.tsx`

```tsx
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
    getEmployeeById  // ✅ Reusable getter function
  }
}
```

#### Step 2: List Screen - pass only ID
**File:** `/src/views/company-directory/CompanyDirectoryScreen.tsx`

```tsx
export function CompanyDirectoryScreen() {
  const router = useRouter()
  const { companyDirectoryList } = useCompanyDirectory()
  
  const handleEmployeePress = (employeeId: string) => {
    router.push(`/app/company-directory/details/${employeeId}`)  // ✅ Only ID
  }

  return (
    <FlatList
      data={companyDirectoryList}
      renderItem={({ item }) => (
        <CompanyDirectoryCard
          employeeResult={item}
          onPress={handleEmployeePress}  // Pass ID, not object
        />
      )}
    />
  )
}
```

#### Step 3: Detail Screen - use same hook with getById
**File:** `/src/views/company-directory/InfoModalScreen.tsx`

```tsx
export default function InfoModalScreen() {
  const { id } = useLocalSearchParams()  // Get ID from URL
  const { getEmployeeById } = useCompanyDirectory()  // Same hook!
  
  const employee = getEmployeeById(id as string)  // ✅ Get from cache
  
  if (!employee) return null
  
  return <View>{employee.fullName}</View>
}
```

### Benefits:
- ✅ Single API call (list screen fetches once)
- ✅ React Query caches data automatically
- ✅ Detail screen reads from same cache (no re-fetch needed)
- ✅ Both screens stay in sync
- ✅ Proper TypeScript types throughout
- ✅ Follows React best practices

---

## Navigation Code Patterns

### Pattern 1: Simple Navigation
```tsx
// OLD
navigation.navigate('ScreenName')

// NEW
router.push('/app/feature/list')
```

### Pattern 2: Navigation with Parameters
```tsx
// OLD
navigation.navigate('DetailScreen', { id: '123', name: 'John' })

// NEW - Use URL params for simple data
router.push(`/app/feature/details/123`)
// Access via: const { id } = useLocalSearchParams()
```

### Pattern 3: Modal Navigation
```tsx
// OLD - State-based modal
const [showModal, setShowModal] = useState(false)
const [selectedItem, setSelectedItem] = useState(null)

const handlePress = (item) => {
  setSelectedItem(item)
  setShowModal(true)
}

return (
  <>
    <List onPress={handlePress} />
    <Modal visible={showModal} onClose={() => setShowModal(false)}>
      <DetailView item={selectedItem} />
    </Modal>
  </>
)

// NEW - Route-based modal
const handlePress = (itemId: string) => {
  router.push(`/app/feature/details/${itemId}`)
}

return <List onPress={handlePress} />
// Modal screen defined in /app/feature/details/[id].tsx
```

### Pattern 4: Going Back
```tsx
// OLD
navigation.goBack()

// NEW
router.back()
```

---

## Layout Configuration

### Template: `/src/app/(application)/app/[feature]/_layout.tsx`

```tsx
import { Stack } from "expo-router"
import { Drawer } from "expo-router/drawer"

export default function FeatureLayout() {
  return (
    <>
      {/* Set title in Drawer header */}
      <Drawer.Screen
        options={{
          title: "Feature Name"  // Shows in drawer header
        }}
      />
      
      {/* Stack navigator for feature */}
      <Stack
        screenOptions={{
          headerShown: false  // Hide stack headers by default
        }}
      >
        {/* Main list/index screen */}
        <Stack.Screen
          name="list"  // or "index"
          options={{
            headerShown: false  // Use drawer header instead
          }}
        />
        
        {/* Modal detail screen */}
        <Stack.Screen
          name="details/[id]"  // Must match folder structure!
          options={{
            presentation: "modal",  // Show as modal
            headerShown: true       // Modal has its own header
          }}
        />
      </Stack>
    </>
  )
}
```

### Important Rules:

1. **Screen name must match file/folder name exactly**
   - File: `details/[id].tsx` → Screen name: `"details/[id]"`
   - File: `list.tsx` → Screen name: `"list"`
   - File: `index.tsx` → Screen name: `"index"`

2. **Drawer.Screen sets the title**
   - Shows in main app drawer header
   - Replaces old stack navigator title
   - Always set this for proper navigation display

3. **headerShown: false for main screens**
   - Main screens use drawer's header
   - Prevents double headers
   - Keeps UI clean and consistent

4. **presentation: "modal" for overlays**
   - Slides up from bottom
   - Has close affordance
   - Can be dismissed with swipe down
   - Feels native on iOS and Android

---

## Step-by-Step Migration Checklist

### Pre-Migration:
- [ ] Identify feature in `/src/navigation/*Stack.tsx`
- [ ] Find corresponding screens in `/src/screens/FeatureScreen/`
- [ ] Note all navigation patterns used (navigate, goBack, params)
- [ ] List all modals that need converting to routes
- [ ] Identify data passed between screens

### Step 1: Copy Files
- [ ] Copy `/src/screens/FeatureScreen/` → `/src/views/feature/`
- [ ] Verify all files copied correctly (components, hooks, utils)
- [ ] **DO NOT modify old files**

### Step 2: Create Route Structure
- [ ] Create `/src/app/(application)/app/feature/` folder
- [ ] Create `_layout.tsx` with Stack + Drawer config
- [ ] Create `list.tsx` (or `index.tsx`) wrapper
- [ ] Create `details/[id].tsx` for modals (if needed)
- [ ] Create additional routes as needed

### Step 3: Update Copied Views
- [ ] Import `useRouter` from `expo-router`
- [ ] Import `useLocalSearchParams` from `expo-router` (for detail screens)
- [ ] Change `navigation.navigate` to `router.push`
- [ ] Change `navigation.goBack` to `router.back`
- [ ] Convert modal components to screen components
- [ ] Update props to receive IDs instead of full objects

### Step 4: Create Data Hook (if needed)
- [ ] Create `useFeatureName.tsx` in `_components/`
- [ ] Move API calls to centralized hook
- [ ] Add `getById(id)` helper function if detail views exist
- [ ] Configure React Query caching (gcTime, staleTime)
- [ ] Export all necessary data and functions
- [ ] Add proper TypeScript types

### Step 5: Update Components
- [ ] Update list cards to pass IDs instead of objects
- [ ] Update card `onPress` handlers to accept IDs
- [ ] Update detail screens to use `useLocalSearchParams()`
- [ ] Update detail screens to use data hook with `getById()`
- [ ] Remove modal state (`useState` for visibility, selected item)
- [ ] Remove modal components from list screens

### Step 6: Test
- [ ] List screen loads correctly
- [ ] Navigation to detail works
- [ ] Modal presentation is correct (slides from bottom)
- [ ] Back navigation works (swipe, button, router.back)
- [ ] Data loads without duplicate fetches
- [ ] TypeScript has no errors
- [ ] Pull-to-refresh still works
- [ ] Search/filters still work

### Step 7: Cleanup (Later)
- [ ] Mark old files for deletion (after **all** features migrated)
- [ ] Remove unused navigation stack files
- [ ] Update imports across the app if needed

---

## Complete Example: Company Directory Migration

### Files Changed Summary:

#### OLD (Untouched):
- ❌ `/src/navigation/CompanyDirectoryStack.tsx` - Delete after migration
- ❌ `/src/screens/CompanyDirectoryScreen/` - Delete after migration

#### NEW (Created):
- ✅ `/src/app/(application)/app/company-directory/_layout.tsx`
- ✅ `/src/app/(application)/app/company-directory/list.tsx`
- ✅ `/src/app/(application)/app/company-directory/details/[id].tsx`
- ✅ `/src/views/company-directory/CompanyDirectoryScreen.tsx` - Copied & modified
- ✅ `/src/views/company-directory/InfoModalScreen.tsx` - Copied & modified
- ✅ `/src/views/company-directory/_components/CompanyDirectoryCard.tsx` - Copied & modified
- ✅ `/src/views/company-directory/_components/useCompanyDirectory.tsx` - New hook

---

### 1. Stack Navigator

#### OLD: `/src/navigation/CompanyDirectoryStack.tsx` (❌ Don't modify)
```tsx
const Stack = createNativeStackNavigator<CompanyDirectoryStackParamList>()

export function CompanyDirectoryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "#111827",
        headerTitleStyle: { color: "#111827" },
        headerStyle: { backgroundColor: "#FFFFFF" }
      }}
    >
      <Stack.Screen
        name="CompanyDirectoryMain"
        component={CompanyDirectoryScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}
```

#### NEW: `/src/app/(application)/app/company-directory/_layout.tsx`
```tsx
import { Stack } from "expo-router"
import { Drawer } from "expo-router/drawer"

export default function InfoLayout() {
  return (
    <>
      <Drawer.Screen
        options={{
          title: "Company Directory"
        }}
      />
      <Stack
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          name="list"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="details/[id]"
          options={{
            presentation: "modal",
            headerShown: true
          }}
        />
      </Stack>
    </>
  )
}
```

---

### 2. Main Screen

#### OLD: `/src/screens/CompanyDirectoryScreen/CompanyDirectoryScreen.tsx` (❌ Don't modify)
```tsx
export function CompanyDirectoryScreen() {
  const [selectedEmployee, setSelectedEmployee] = useState<ExternalUser | null>(null)
  const [showModal, setShowModal] = useState(false)
  
  const { data } = api.externalUsers.getCompanyDirectoryResults.useQuery()
  
  const handleEmployeePress = (employee: ExternalUser) => {
    setSelectedEmployee(employee)  // ❌ Store full object
    setShowModal(true)              // ❌ State-based modal
  }
  
  return (
    <SafeAreaView>
      <Drawer.Screen options={{ title: "Company Directory" }} />
      {/* Search and list */}
      <FlatList renderItem={...} />
      
      {/* State-based modal */}
      <EmployeeDetailModal 
        visible={showModal}
        employee={selectedEmployee}  // ❌ Pass full object
        onClose={() => setShowModal(false)}
      />
    </SafeAreaView>
  )
}
```

#### NEW: `/src/views/company-directory/CompanyDirectoryScreen.tsx`
```tsx
export function CompanyDirectoryScreen() {
  const router = useRouter()  // ✅ Expo router
  const [searchText, setSearchText] = useState("")
  
  const {
    companyDirectoryList,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useCompanyDirectory()  // ✅ Centralized hook
  
  const filteredData = companyDirectoryList?.filter(
    (employee) =>
      employee.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.title?.toLowerCase().includes(searchText.toLowerCase())
  )
  
  const handleEmployeePress = (employeeId: string) => {
    router.push(`/app/company-directory/details/${employeeId}`)  // ✅ Route navigation
  }
  
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <LoadingSpinner size={48} />
      </View>
    )
  }
  
  return (
    <View className="flex-1 bg-white">
      {/* Search Bar */}
      <View className="m-4">
        <View className="flex-row items-center bg-gray-100 rounded-md px-4">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <Input
            className="ml-3 flex-1 border-0 bg-transparent p-0 shadow-none"
            placeholder="Search employees..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Employee List */}
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <CompanyDirectoryCard
            employeeResult={item}
            onPress={handleEmployeePress}  // ✅ Pass ID handler
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      />
      {/* ✅ No modal component needed */}
    </View>
  )
}
```

---

### 3. Card Component

#### OLD: `/src/screens/CompanyDirectoryScreen/_components/CompanyDirectoryCard.tsx` (❌ Don't modify)
```tsx
type CompanyDirectoryCardProps = {
  employeeResult: ExternalUser
  onPress?: (employee: ExternalUser) => void  // ❌ Full object
}

export function CompanyDirectoryCard(props: CompanyDirectoryCardProps) {
  const { employeeResult, onPress } = props
  
  const handleCardPress = () => {
    if (onPress) {
      onPress(employeeResult)  // ❌ Pass full object
    }
  }
  
  return (
    <Pressable onPress={handleCardPress}>
      <Card>
        {/* Card content */}
      </Card>
    </Pressable>
  )
}
```

#### NEW: `/src/views/company-directory/_components/CompanyDirectoryCard.tsx`
```tsx
type CompanyDirectoryCardProps = {
  employeeResult: ExternalUser
  onPress?: (employeeId: string) => void  // ✅ Just ID
}

export function CompanyDirectoryCard(props: CompanyDirectoryCardProps) {
  const { employeeResult, onPress } = props
  
  const handleCardPress = () => {
    if (onPress) {
      onPress(employeeResult.id)  // ✅ Pass only ID
    }
  }
  
  const handleEmailPress = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    if (employeeResult.email) {
      Linking.openURL(`mailto:${employeeResult.email}`)
    }
  }
  
  return (
    <Pressable onPress={handleCardPress}>
      <Card className="mb-4 border-gray-200 bg-white">
        <CardContent className="flex-row items-center">
          <View className="flex-1">
            <Text className="font-semibold text-base">
              {employeeResult.fullName}
            </Text>
            <Text className="mt-0 text-xs">{employeeResult.title}</Text>
          </View>
          
          {/* Action buttons */}
          <View className="flex-row items-center gap-2">
            {employeeResult.email && (
              <Pressable onPress={handleEmailPress}>
                <Ionicons name="mail" size={20} color="#3B82F6" />
              </Pressable>
            )}
          </View>
        </CardContent>
      </Card>
    </Pressable>
  )
}
```

---

### 4. Data Hook (NEW)

#### NEW: `/src/views/company-directory/_components/useCompanyDirectory.tsx`
```tsx
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

  // ✅ Helper to get individual item by ID
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
    getEmployeeById  // ✅ Shared across list and detail screens
  }
}
```

---

### 5. Detail Modal → Detail Screen

#### OLD: `/src/screens/CompanyDirectoryScreen/_components/EmployeeDetailModal.tsx` (❌ Don't modify)
```tsx
interface EmployeeDetailModalProps {
  visible: boolean          // ❌ State-based
  employee: ExternalUser | null  // ❌ Full object from parent
  onClose: () => void
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  visible,
  employee,
  onClose
}) => {
  if (!employee) return null
  
  const handleEmailPress = () => {
    if (employee.email) {
      Linking.openURL(`mailto:${employee.email}`)
    }
  }
  
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1">
        {/* Modal Header */}
        <View className="flex-row items-center justify-between p-4">
          <Text variant="h3">Employee Details</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} />
          </Pressable>
        </View>
        
        {/* Modal Content */}
        <ScrollView>
          {/* Employee details */}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}
```

#### NEW: `/src/views/company-directory/InfoModalScreen.tsx`
```tsx
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { View, Pressable, Linking, ScrollView } from "react-native"
import { Text } from "#/components/ui/text"
import { Card, CardContent, CardHeader } from "#/components/ui/card"
import { Ionicons } from "@expo/vector-icons"
import { useCompanyDirectory } from "./_components/useCompanyDirectory"

export default function InfoModalScreen() {
  const { id } = useLocalSearchParams()  // ✅ From URL
  const { getEmployeeById } = useCompanyDirectory()  // ✅ Shared hook
  const router = useRouter()
  
  const employee = getEmployeeById(id as string)  // ✅ Get from cache
  
  if (!employee) return null
  
  const handleEmailPress = () => {
    if (employee.email) {
      Linking.openURL(`mailto:${employee.email}`)
    }
  }
  
  const handlePhonePress = () => {
    if (employee.phone) {
      Linking.openURL(`tel:${employee.phone}`)
    }
  }
  
  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          title: employee.fullName,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Ionicons name="close" size={24} color="#374151" />
            </Pressable>
          )
        }}
      />
      
      <ScrollView className="flex-1">
        {/* Header Card */}
        <Card className="mb-6 border-gray-200 bg-white">
          <CardContent className="items-center py-8">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-blue-500">
              <Text className="font-semibold text-2xl text-white">
                {employee.fullName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()}
              </Text>
            </View>
            <Text variant="h3" className="mb-2 text-center">
              {employee.fullName}
            </Text>
            <Text className="text-center text-muted-foreground">
              {employee.title}
            </Text>
          </CardContent>
        </Card>
        
        {/* Contact Actions */}
        <View className="mb-6 flex-row gap-4">
          {employee.email && (
            <ActionButton
              label="Email"
              icon="mail"
              onPress={handleEmailPress}
            />
          )}
          {employee.phone && (
            <ActionButton
              label="Call"
              icon="call"
              onPress={handlePhonePress}
              color="#10B981"
            />
          )}
        </View>
        
        {/* Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <Text variant="h4">Contact Information</Text>
          </CardHeader>
          <CardContent>
            <DetailRow label="Email" value={employee.email} icon="mail" />
            <DetailRow label="Phone" value={employee.phone} icon="call" />
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  )
}

// Helper components
const DetailRow = ({
  label,
  value,
  icon
}: {
  label: string
  value?: string
  icon: keyof typeof Ionicons.glyphMap
}) => {
  if (!value) return null
  
  return (
    <View className="flex-row items-start border-gray-200 border-b py-4">
      <View className="mr-4 mt-1">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-blue-50">
          <Ionicons name={icon} size={16} color="#3B82F6" />
        </View>
      </View>
      <View className="flex-1">
        <Text className="mb-1 text-muted-foreground text-xs uppercase">
          {label}
        </Text>
        <Text className="text-base font-medium">{value}</Text>
      </View>
    </View>
  )
}

const ActionButton = ({
  label,
  icon,
  onPress,
  color = "#3B82F6"
}: {
  label: string
  icon: keyof typeof Ionicons.glyphMap
  onPress: () => void
  color?: string
}) => (
  <Pressable
    onPress={onPress}
    className="flex-1 flex-row items-center justify-center rounded-lg p-4"
    style={{ backgroundColor: color }}
  >
    <Ionicons name={icon} size={20} color="white" />
    <Text className="ml-2 font-semibold text-white">{label}</Text>
  </Pressable>
)
```

---

### 6. Route Wrappers

#### NEW: `/src/app/(application)/app/company-directory/list.tsx`
```tsx
import { CompanyDirectoryScreen } from "#/views/company-directory/CompanyDirectoryScreen"

export default function CompanyDirectoryList() {
  return <CompanyDirectoryScreen />
}
```

#### NEW: `/src/app/(application)/app/company-directory/details/[id].tsx`
```tsx
import InfoModalScreen from "#/views/company-directory/InfoModalScreen"

export default function InfoModalScreenWrapper() {
  return <InfoModalScreen />
}
```

---

## Quick Reference

### Dynamic Routes
| File Structure | Route | Access Params |
|---------------|-------|---------------|
| `[id].tsx` | `/feature/123` | `const { id } = useLocalSearchParams()` |
| `[slug].tsx` | `/feature/my-item` | `const { slug } = useLocalSearchParams()` |
| `details/[id].tsx` | `/feature/details/123` | `const { id } = useLocalSearchParams()` |
| `edit/[id].tsx` | `/feature/edit/123` | `const { id } = useLocalSearchParams()` |

### Presentation Modes
| Mode | When to Use | Configuration |
|------|-------------|---------------|
| Default | List/main screens | `headerShown: false` (use drawer header) |
| Modal | Detail overlays, view-only | `presentation: "modal", headerShown: true` |
| Card (iOS) | Alternative modal style | `presentation: "card"` |
| Form Screen | Alternative for full screen forms | `presentation: "formSheet"` |

### Data Hook Pattern Checklist
When creating a centralized data hook, always include:

- [ ] API query with React Query
- [ ] Loading/error states
- [ ] Refetch function (for pull-to-refresh)
- [ ] `getById()` helper for detail screens
- [ ] React Query `gcTime` configuration (cache time)
- [ ] React Query `staleTime` configuration (freshness)
- [ ] Proper TypeScript types
- [ ] useCallback for derived functions
- [ ] Clear return object with all exports

### Common Imports
```tsx
// Routing
import { useRouter, useLocalSearchParams, Stack } from "expo-router"
import { Drawer } from "expo-router/drawer"

// Data fetching
import { api } from "#/trpc/react"

// React
import { useCallback } from "react"
```

---

## Tips & Best Practices

1. **Always test navigation flows**
   - Forward navigation (list → detail)
   - Back navigation (detail → list)
   - Swipe to dismiss modals
   - Deep linking if needed

2. **Cache configuration matters**
   - Set appropriate `gcTime` for data that doesn't change often
   - Set `staleTime` based on acceptable staleness
   - Consider network conditions and UX

3. **TypeScript is your friend**
   - Proper types prevent runtime errors
   - Use type inference from tRPC
   - Define clear prop interfaces

4. **Keep screens focused**
   - One responsibility per screen
   - Extract complex logic to hooks
   - Reusable components in `_components/`

5. **Test on both platforms**
   - iOS and Android have different modal behaviors
   - Swipe gestures may differ
   - Header layouts can vary

---

## Next Steps After Migration

1. Delete old navigation files from `/src/navigation/`
2. Delete old screen files from `/src/screens/`
3. Update any remaining imports
4. Run full app test on both iOS and Android
5. Update documentation if patterns changed
6. Consider performance optimizations (lazy loading, etc.)

