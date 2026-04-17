import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query"
import SuperJSON from "superjson"

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        gcTime: 1000 * 60 * 60 * 1, // 1 hour
        staleTime: 120 * 1000 // 2 minutes
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending"
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize
      }
    }
  })
