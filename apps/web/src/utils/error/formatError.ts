import type { PublicErrorDetails } from "./types"

/**
 * Format an error for client-side display
 * Sanitizes sensitive information in production
 *
 * @param error - The error object from the error boundary
 * @returns PublicErrorDetails safe to show to users
 */
export function formatErrorForClient(
  error: Error & { digest?: string }
): PublicErrorDetails {
  const isDev = process.env.NODE_ENV === "development"

  return {
    timestamp: new Date().toISOString(),
    errorId: error.digest ?? crypto.randomUUID(),
    // In production, show generic message; in development, show actual error
    message: isDev ? error.message : "An unexpected error occurred",
    route:
      typeof window !== "undefined" ? window.location.pathname : "server-side",
    environment:
      (process.env.NODE_ENV as "development" | "production") ?? "production"
  }
}

/**
 * Convert error details to a JSON string for copying
 *
 * @param details - The error details to serialize
 * @param includeStack - Whether to include stack trace (only in development)
 * @returns Formatted JSON string
 */
export function errorToJsonString(
  details: PublicErrorDetails,
  stack?: string
): string {
  const isDev = details.environment === "development"

  return JSON.stringify(
    {
      ...details,
      ...(isDev && stack ? { stack } : {})
    },
    null,
    2
  )
}
