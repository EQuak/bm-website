"use client"

import type { AppRouter } from "@repo/api"
import type { QueryClient } from "@tanstack/react-query"
import { QueryClientProvider } from "@tanstack/react-query"

import { httpBatchLink, loggerLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import Constants from "expo-constants"
import { useState } from "react"
import { Platform } from "react-native"
import SuperJSON from "superjson"

import { supabase } from "#/utils/supabase/client"
import { createQueryClient } from "./query-client"

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient()
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient())
}

export const api = createTRPCReact<AppRouter>()

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>

export function TRPCProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers: async () => {
            const {
              data: { session }
            } = await supabase.auth.getSession()

            if (!session) return {}

            // Get the first 8 chars of the anon key from Constants
            const anonKey =
              Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? ""
            const keyFromUrl = anonKey.slice(0, 8)

            const headers = {
              "x-trpc-source": "expo-react",
              Authorization: `Bearer ${session.access_token}`,
              Cookie: `sb-${keyFromUrl}=${session.access_token}; Path=/; HttpOnly; SameSite=Lax`
            }

            return headers
          },
          fetch: async (url, options) => {
            console.log("Fetching:", url)
            try {
              const response = await fetch(url, options)
              console.log("Response status:", response.status)
              return response
            } catch (error) {
              console.error("Fetch error:", error)
              throw error
            }
          }
        }),
        loggerLink({
          enabled: (opts) =>
            __DEV__ ||
            (opts.direction === "down" && opts.result instanceof Error),
          colorMode: "ansi"
        })
      ]
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  )
}

export function getBaseUrl() {
  // For web platform
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return window.location.origin
  }

  // For production
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  // For React Native development - use Expo's hostUri to automatically detect the dev machine IP
  if (Platform.OS === "ios" || Platform.OS === "android") {
    /**
     * Gets the IP address of your host-machine. If it cannot automatically find it,
     * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
     * you don't have anything else running on it, or you'd have to change it.
     */
    const debuggerHost = Constants.expoConfig?.hostUri
    const localhost = debuggerHost?.split(":")[0]

    if (!localhost) {
      console.error(
        "❌ Failed to get localhost from Expo. Falling back to manual IP."
      )
      console.error(
        "💡 Make sure your Next.js dev server is running and accessible."
      )
      // Fallback to common development IPs
      return Platform.OS === "android"
        ? "http://10.0.2.2:8989"
        : "http://localhost:8989"
    }

    const baseUrl = `http://${localhost}:8989`
    console.log(
      `🌐 Platform: ${Platform.OS}, Auto-detected base URL: ${baseUrl}`
    )
    return baseUrl
  }

  return `http://localhost:${process.env.PORT ?? 8989}`
}
