"use client"

import { Button, Center, Code, Stack, Text, Title } from "@repo/mantine-ui"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { Custom500Logo } from "#/assets/icons"
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
    console.error("[Error Boundary]", error)
  }, [error])

  return (
    <Center h="100vh" p="md">
      <Stack align="center" gap="lg" maw={500}>
        <Custom500Logo height={120} />

        <Title order={1} ta="center">
          Something went wrong
        </Title>

        <Text c="dimmed" ta="center" size="sm">
          We encountered an unexpected error. Please try again or contact
          support if the problem persists.
        </Text>

        <Code block>{errorDetails.message}</Code>

        <Stack gap="sm" w="100%">
          <Button onClick={reset}>Try again</Button>
          <Button variant="default" onClick={() => router.push("/")}>
            Go home
          </Button>
        </Stack>

        {process.env.NODE_ENV === "development" && error.stack ? (
          <Code block className="max-h-48 overflow-auto text-xs">
            {error.stack}
          </Code>
        ) : null}
      </Stack>
    </Center>
  )
}
