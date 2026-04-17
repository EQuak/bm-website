import { QueryClient } from "@tanstack/react-query"

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Set reasonable stale time for mobile apps
        staleTime: 30 * 1000,
        // Retry failed requests
        retry: 2,
        // Cache time for mobile
        gcTime: 5 * 60 * 1000 // 5 minutes
      }
    }
  })
