"use client"

import { Center, Stack, Text, Title } from "@repo/mantine-ui"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { Custom500Logo } from "#/assets/icons"
import { ErrorDetails } from "#/core/components/ErrorDetails"
import { formatErrorForClient } from "#/utils/error/formatError"

/**
 * Error Boundary for the (application) route group
 *
 * This catches errors that occur before the user is fully authenticated
 * within the application layout.
 */
export default function ApplicationError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const errorDetails = formatErrorForClient(error)

  useEffect(() => {
    console.error("[Application Error]", error)
  }, [error])

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <Center h="100vh" p="md">
      <Stack align="center" gap="lg" maw={500}>
        <Custom500Logo height={120} />

        <Title order={1} ta="center">
          Application Error
        </Title>

        <Text c="dimmed" ta="center" size="sm">
          We encountered an error while loading the application. Please try
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
