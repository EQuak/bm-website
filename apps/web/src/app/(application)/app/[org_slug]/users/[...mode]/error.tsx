"use client"

import { Center, Stack, Text, Title } from "@repo/mantine-ui"
import { useRouter } from "next/navigation"
// import { usePostHog } from "posthog-js/react"
import { useEffect } from "react"

import { Custom500Logo } from "#/assets/icons"
import { ErrorDetails } from "#/core/components/ErrorDetails"
import { formatErrorForClient } from "#/utils/error/formatError"

/**
 * Error Boundary for Users
 *
 * Catches errors that occur when creating or editing user records.
 */
export default function UsersError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // const posthog = usePostHog()
  const router = useRouter()
  const errorDetails = formatErrorForClient(error)

  useEffect(() => {
    console.error("[Users Error]", error)
    // posthog.captureException(error)
  }, [error])

  const handleGoHome = () => {
    router.push("/app/users/list")
  }

  return (
    <Center h="100%" p="md" mih="50vh">
      <Stack align="center" gap="lg" maw={500}>
        <Custom500Logo height={100} />

        <Title order={2} ta="center">
          Error in Users Records
        </Title>

        <Text c="dimmed" ta="center" size="sm">
          We encountered an error with the users record. Please try again or
          talk with support and share the error details below.
        </Text>

        <ErrorDetails
          error={errorDetails}
          onReset={reset}
          onGoHome={handleGoHome}
          stack={error.stack}
          showStackInDev
        />
      </Stack>
    </Center>
  )
}
