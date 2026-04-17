"use client"

import { Center, Stack, Text, Title } from "@repo/mantine-ui"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { Custom500Logo } from "#/assets/icons"
import { ErrorDetails } from "#/core/components/ErrorDetails"
import { formatErrorForClient } from "#/utils/error/formatError"

/**
 * Error Boundary for the authentication flow
 *
 * This catches errors that occur during login, registration,
 * password reset, and other auth-related operations.
 */
export default function AuthError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const errorDetails = formatErrorForClient(error)

  useEffect(() => {
    console.error("[Auth Error]", error)
  }, [error])

  const handleGoHome = () => {
    router.push("/login")
  }

  return (
    <Center h="100vh" p="md">
      <Stack align="center" gap="lg" maw={500}>
        <Custom500Logo height={100} />

        <Title order={2} ta="center">
          Authentication Error
        </Title>

        <Text c="dimmed" ta="center" size="sm">
          We encountered an error during the authentication process. Please try
          again or contact support if the problem persists.
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
