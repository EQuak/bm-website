import { appRouter, captureServerException, createTRPCContext } from "@repo/api"
import { TRPCError } from "@trpc/server"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import type { NextRequest } from "next/server"

import { env } from "#/env"
import { createSBAdminServer, createSBServer } from "#/utils/supabase/server"

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
function setCorsHeaders(res: Response) {
  res.headers.set("Access-Control-Allow-Origin", "*")
  res.headers.set("Access-Control-Request-Method", "*")
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST")
  res.headers.set("Access-Control-Allow-Headers", "*")
}

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  const supabase = await createSBServer()
  const supabaseAdmin = await createSBAdminServer()

  return createTRPCContext({
    headers: req.headers,
    supabase,
    supabaseAdmin
  })
}

const handler = async (req: NextRequest) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError: async ({ path, error, ctx, input }) => {
      // Log errors in development with more detail
      if (env.NODE_ENV === "development") {
        console.error(
          `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
        )
        if (error.cause) {
          console.error("  Cause:", error.cause)
        }
      }

      const errorCode =
        error instanceof TRPCError ? error.code : "INTERNAL_SERVER_ERROR"

      // Safely serialize input for logging (avoid circular refs and sensitive data)
      let safeInput: string | undefined
      try {
        if (input !== undefined) {
          const inputStr = JSON.stringify(input)
          // Truncate very large inputs to avoid log bloat
          safeInput =
            inputStr.length > 1000 ? `${inputStr.slice(0, 1000)}...` : inputStr
        }
      } catch {
        safeInput = "[unserializable input]"
      }

      await captureServerException(error, {
        userId: ctx?.user?.id,
        path: path ?? "<no-path>",
        errorCode,
        extra: {
          source: "trpc",
          url: req.url,
          method: req.method,
          input: safeInput
        }
      })
    }
  })

  setCorsHeaders(response)

  return response
}

export { handler as GET, handler as POST }
