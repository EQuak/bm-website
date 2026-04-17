/**
 * Server exception logging
 */

export interface ServerExceptionContext {
  userId?: string
  path?: string
  errorCode?: string
  extra?: Record<string, unknown>
}

function extractErrorCause(error: Error): {
  causeMessage?: string
  causeType?: string
  causeStack?: string
} {
  const cause = (error as Error & { cause?: unknown }).cause
  if (!cause) return {}
  if (cause instanceof Error) {
    return {
      causeMessage: cause.message,
      causeType: cause.name,
      causeStack: cause.stack
    }
  }
  if (typeof cause === "string") return { causeMessage: cause }
  if (typeof cause === "object") return { causeMessage: JSON.stringify(cause) }
  return {}
}

export async function captureServerException(
  error: Error,
  context: ServerExceptionContext = {}
): Promise<void> {
  const causeInfo = extractErrorCause(error)
  console.error("[Server Exception]", {
    error: error.message,
    errorType: error.name,
    cause: causeInfo.causeMessage,
    causeType: causeInfo.causeType,
    path: context.path,
    errorCode: context.errorCode,
    userId: context.userId,
    ...context.extra
  })
}
