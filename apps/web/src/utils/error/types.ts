/**
 * Public error details that are safe to show to users
 * Used in the copy-to-clipboard functionality
 */
export interface PublicErrorDetails {
  /** ISO timestamp of when the error occurred */
  timestamp: string
  /** Unique error identifier (digest or generated UUID) */
  errorId: string
  /** Sanitized error message (generic in production, detailed in development) */
  message: string
  /** The route/path where the error occurred */
  route: string
  /** Current environment */
  environment: "development" | "production"
}

/**
 * Full error details including sensitive information
 * Used for development debugging
 */
export interface InternalErrorDetails extends PublicErrorDetails {
  /** Stack trace (only available in development) */
  stack?: string
  /** User ID if authenticated */
  userId?: string
  /** Browser user agent */
  userAgent?: string
  /** Original error object */
  originalError?: unknown
}

/**
 * Props for error boundary components
 */
export interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}
