# Documentation references

This document centralizes all official references for technologies used in the project.

## Core Technologies

### Next.js 15

[@https://nextjs.org/docs](https://nextjs.org/docs)

- Official Next.js 15 documentation
- Focus on App Router and Server Components
- Performance optimization and best practices

### Drizzle ORM

[@https://orm.drizzle.team/docs/overview](https://orm.drizzle.team/docs/overview)

- TypeScript-first ORM for PostgreSQL
- Migrations and schema management
- Type-safe and performant queries

### Supabase

[@https://supabase.com/docs](https://supabase.com/docs)

- Authentication (Phone OTP, Email OTP)
- PostgreSQL Database
- File Storage
- Row Level Security (RLS)

## UI Components

### Mantine UI

[@https://mantine.dev/getting-started/](https://mantine.dev/getting-started/)

- Modern and responsive UI components
- Tailwind CSS based styling
- Accessibility best practices
- Form management with useForm

### Mantine Form

[@https://mantine.dev/form/use-form/](https://mantine.dev/form/use-form/)

- Form state management
- Validation and error handling
- Field arrays and nested forms
- Performance optimization

### Tailwind CSS

[@https://tailwindcss.com/docs](https://tailwindcss.com/docs)

- Utility-first CSS framework
- Integration with Mantine
- Custom configuration
- Responsive design

## Development Tools

### TRPC

[@https://trpc.io/docs](https://trpc.io/docs)

- End-to-end typesafe APIs
- Integration with Next.js
- Query invalidation and caching
- Error handling

### TypeScript

[@https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)

- Type system and best practices
- Advanced types and utilities
- Configuration and tooling
- Integration with Next.js

### Turborepo

[@https://turbo.build/repo/docs](https://turbo.build/repo/docs)

- Monorepo management
- Build caching
- Workspace dependencies
- Pipeline configuration

## Usage Patterns

1. **Database & ORM**

   - Follow Drizzle patterns for queries and schemas
   - Implement RLS patterns in Supabase
   - Optimize database performance
   - Handle migrations properly

2. **UI/UX**

   - Prioritize Mantine components
   - Extend with Tailwind when needed
   - Maintain visual consistency
   - Follow accessibility guidelines

3. **Next.js**

   - Implement App Router patterns
   - Use Server Components appropriately
   - Optimize data fetching
   - Handle client/server boundaries

4. **Monitoring & Error Handling**

   - Configure PostHog error boundaries
   - Set up performance monitoring
   - Track user sessions
   - Handle error reporting

5. **Type Safety**

   - Leverage TRPC for API types
   - Use Zod for validation
   - Maintain strict TypeScript config
   - Document type patterns

## Additional Resources

### Testing

- Jest: [@https://jestjs.io/docs/getting-started](https://jestjs.io/docs/getting-started)
- Playwright: [@https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)

### State Management

- Zustand: [@https://docs.pmnd.rs/zustand/getting-started/introduction](https://docs.pmnd.rs/zustand/getting-started/introduction)
- React Query: [@https://tanstack.com/query/latest/docs/react/overview](https://tanstack.com/query/latest/docs/react/overview)

### Development Tools

- pnpm: [@https://pnpm.io/motivation](https://pnpm.io/motivation)
- ESLint: [@https://eslint.org/docs/latest/](https://eslint.org/docs/latest/)
- Prettier: [@https://prettier.io/docs/en/](https://prettier.io/docs/en/)

> **Note**: Keep these documentations as constant reference during development. They are the official source of best practices and patterns for the project.
