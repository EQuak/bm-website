"use client"

import { Center, Stack, Text, Title } from "@repo/mantine-ui"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { Custom500Logo } from "#/assets/icons"
import { ErrorDetails } from "#/core/components/ErrorDetails"
import { formatErrorForClient } from "#/utils/error/formatError"

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const errorDetails = formatErrorForClient(error)

  useEffect(() => {
    // Log the error to console in development
    console.error("[Error Boundary]", error)
  }, [error])

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <Center h="100vh" p="md">
      <Stack align="center" gap="lg" maw={500}>
        {/* Error Icon */}
        <Custom500Logo height={120} />

        {/* Title */}
        <Title order={1} ta="center">
          Something went wrong
        </Title>

        {/* Description */}
        <Text c="dimmed" ta="center" size="sm">
          We encountered an unexpected error. Please try again or contact
          support if the problem persists.
        </Text>

        {/* Error Details with Copy Button */}
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
