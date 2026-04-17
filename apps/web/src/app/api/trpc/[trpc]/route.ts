import { appRouter, captureServerException, createTRPCContext } from "@repo/api"
import { TRPCError } from "@trpc/server"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import type { NextRequest } from "next/server"

import { env } from "#/env"

function setCorsHeaders(res: Response) {
  res.headers.set("Access-Control-Allow-Origin", "*")
  res.headers.set("Access-Control-Request-Method", "*")
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST")
  res.headers.set("Access-Control-Allow-Headers", "*")
}

const createContext = async (req: NextRequest) =>
  createTRPCContext({ headers: req.headers })

const handler = async (req: NextRequest) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError: async ({ path, error, input }) => {
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

      let safeInput: string | undefined
      try {
        if (input !== undefined) {
          const inputStr = JSON.stringify(input)
          safeInput =
            inputStr.length > 1000 ? `${inputStr.slice(0, 1000)}...` : inputStr
        }
      } catch {
        safeInput = "[unserializable input]"
      }

      await captureServerException(error, {
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
