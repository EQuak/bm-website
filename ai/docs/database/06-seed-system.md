# Seed system

The seed system is responsible for populating the database with test data, essential for development and testing of UI and functionality.

## System Structure

```
packages/db/src/seed/
├── seed.ts              # Main orchestration file
├── funcs/              # Seed functions by domain
│   ├── _aux.ts         # Helper functions
│   ├── acls_roles_seed.ts
│   ├── authUsers_seed.ts
│   ├── building_seed.ts
│   ├── categories_seed.ts
│   ├── items_seed.ts
│   └── profiles_seed.ts
└── consts/             # Seed constants and data
    └── consts_seed.ts
```

## Main Seed File (seed.ts)

The `seed.ts` file is responsible for:

1. Orchestrating seed execution order
2. Database reset before seeding
3. Preventing execution in production

```typescript
async function seed() {
  if (process.env.NODE_ENV === "production") {
    console.log("Seeding not allowed in production")
    process.exit(0)
  }

  try {
    // Reset database
    await reset(db, schema)

    // Execute seeds in order
    const roles = await seedAclsRoles({ db })
    const users = await seedAuthUsers({ db })
    const profiles = await seedProfiles({ db, users })
    // ... other seeds
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}
```

## Implementation Patterns

### 1. Seed Functions

Each seed function follows a consistent pattern:

```typescript
export async function seedProfiles({
  db,
  users,
  count = 10
}: {
  db: DB
  users: User[]
  count?: number
}) {
  const profiles: ProfileTableInsert[] = users.map(user => ({
    id: user.id,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: user.email,
    phone: faker.phone.number("###-###-####"),
    active: true
  }))

  return await db.insert(ProfileTable).values(profiles).returning()
}
```

### 2. Using Faker

We use faker-js for realistic data generation:

```typescript
function generateInventoryItem(): InventoryTableInsert {
  return {
    itemSku: faker.string.alphanumeric(8).toUpperCase(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    quantity: faker.number.int({ min: 0, max: 1000 }),
    minQuantity: faker.number.int({ min: 0, max: 100 })
  }
}
```

## Important Commands

### Database Reset

```bash
# Development seed (recommended)
pnpm db:seed

# Complete database reset (rarely needed)
pnpm db:reset
```

### When to Use Each Command

- `pnpm db:seed`: Daily use, resets and populates database
- `pnpm db:reset`: Use when:
  - Major structural changes
  - Migration conflicts
  - Database state issues

## Best Practices

1. **Data Generation**

   - Use faker for realistic data
   - Maintain data relationships
   - Generate appropriate volumes
   - Consider edge cases

2. **Execution Order**

   - Respect table dependencies
   - Handle foreign key constraints
   - Document dependencies
   - Use transaction when needed

3. **Development Environment**

   - Never seed production
   - Keep sensitive data in dev only
   - Use environment variables
   - Document seed requirements

4. **Performance**

   - Batch inserts when possible
   - Monitor seed execution time
   - Optimize large data sets
   - Use efficient generation methods

## Implementation Examples

### 1. Complex Relations

```typescript
export async function seedInventory({
  db,
  locations,
  count = 100
}: {
  db: DB
  locations: Location[]
  count?: number
}) {
  const items = Array.from({ length: count }, () => ({
    ...generateInventoryItem(),
    locationId: faker.helpers.arrayElement(locations).id
  }))

  return await db.transaction(async tx => {
    const savedItems = await tx.insert(InventoryTable).values(items).returning()

    const quantities = savedItems.map(item => ({
      itemId: item.id,
      locationId: item.locationId,
      quantity: faker.number.int({ min: 0, max: 1000 })
    }))

    await tx.insert(InventoryQuantityTable).values(quantities)
    return savedItems
  })
}
```

### 2. Dependent Seeds

```typescript
export async function seedProjects({
  db,
  users,
  buildingTypes
}: {
  db: DB
  users: User[]
  buildingTypes: BuildingType[]
}) {
  const projects = Array.from({ length: 20 }, () => ({
    name: faker.company.name(),
    description: faker.company.catchPhrase(),
    ownerId: faker.helpers.arrayElement(users).id,
    buildingTypeId: faker.helpers.arrayElement(buildingTypes).id,
    status: faker.helpers.arrayElement(["active", "completed", "on_hold"])
  }))

  return await db.insert(ProjectTable).values(projects).returning()
}
```

This structure ensures:

- Consistent data generation
- Proper relationship handling
- Efficient seeding process
- Development-ready data
- Maintainable seed system
