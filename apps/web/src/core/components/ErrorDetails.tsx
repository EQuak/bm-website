"use client"

import {
  ActionIcon,
  Button,
  Code,
  Collapse,
  CopyButton,
  Group,
  Paper,
  rem,
  Stack,
  Text,
  Tooltip
} from "@repo/mantine-ui"
import {
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconCopy,
  IconHome,
  IconRefresh
} from "@repo/mantine-ui/icons/index"
import { useState } from "react"
import { errorToJsonString } from "#/utils/error/formatError"
import type { PublicErrorDetails } from "#/utils/error/types"

interface ErrorDetailsProps {
  /** The formatted error details */
  error: PublicErrorDetails
  /** Function to reset the error boundary */
  onReset?: () => void
  /** Function to navigate home */
  onGoHome?: () => void
  /** Whether to show stack trace in development */
  showStackInDev?: boolean
  /** The stack trace (only shown in development) */
  stack?: string
}

/**
 * Component to display error details with copy functionality
 * Used in error boundaries to provide users with error information
 */
export function ErrorDetails({
  error,
  onReset,
  onGoHome,
  showStackInDev = true,
  stack
}: ErrorDetailsProps) {
  const [showStack, setShowStack] = useState(false)
  const isDev = error.environment === "development"
  const jsonOutput = errorToJsonString(error, stack)

  return (
    <Paper withBorder p="md" radius="md" bg="gray.0">
      <Stack gap="md">
        {/* Error ID */}
        <Group gap="xs">
          <Text size="sm" c="dimmed">
            Error ID:
          </Text>
          <CopyButton value={error.errorId} timeout={2000}>
            {({ copied, copy }) => (
              <Group gap={4} wrap="nowrap">
                <Text size="sm" fw={500} ff="monospace">
                  {error.errorId.slice(0, 8)}...
                </Text>
                <Tooltip
                  label={copied ? "Copied" : "Copy ID"}
                  withArrow
                  position="right"
                >
                  <ActionIcon
                    color={copied ? "teal" : "gray"}
                    variant="subtle"
                    onClick={copy}
                    size="sm"
                  >
                    {copied ? (
                      <IconCheck style={{ width: rem(14) }} />
                    ) : (
                      <IconCopy style={{ width: rem(14) }} />
                    )}
                  </ActionIcon>
                </Tooltip>
              </Group>
            )}
          </CopyButton>
        </Group>

        {/* Error Message */}
        <Text size="sm">{error.message}</Text>

        {/* Timestamp and Route (in dev) */}
        {isDev && (
          <Stack gap={4}>
            <Text size="xs" c="dimmed">
              Time: {new Date(error.timestamp).toLocaleString()}
            </Text>
            <Text size="xs" c="dimmed">
              Route: {error.route}
            </Text>
          </Stack>
        )}

        {/* Action Buttons */}
        <Group gap="sm">
          <CopyButton value={jsonOutput} timeout={2000}>
            {({ copied, copy }) => (
              <Button
                leftSection={
                  copied ? (
                    <IconCheck style={{ width: rem(16) }} />
                  ) : (
                    <IconCopy style={{ width: rem(16) }} />
                  )
                }
                variant="light"
                color={copied ? "teal" : "gray"}
                onClick={copy}
                size="sm"
              >
                {copied ? "Copied!" : "Copy Error Details"}
              </Button>
            )}
          </CopyButton>

          {onReset && (
            <Button
              leftSection={<IconRefresh style={{ width: rem(16) }} />}
              variant="light"
              onClick={onReset}
              size="sm"
            >
              Try Again
            </Button>
          )}

          {onGoHome && (
            <Button
              leftSection={<IconHome style={{ width: rem(16) }} />}
              variant="subtle"
              onClick={onGoHome}
              size="sm"
            >
              Go Home
            </Button>
          )}
        </Group>

        {/* Stack Trace (only in development) */}
        {isDev && showStackInDev && stack && (
          <Stack gap="xs">
            <Button
              variant="subtle"
              color="gray"
              size="xs"
              onClick={() => setShowStack(!showStack)}
              rightSection={
                showStack ? (
                  <IconChevronUp style={{ width: rem(14) }} />
                ) : (
                  <IconChevronDown style={{ width: rem(14) }} />
                )
              }
            >
              {showStack ? "Hide" : "Show"} Stack Trace
            </Button>
            <Collapse in={showStack}>
              <Code
                block
                style={{
                  maxHeight: 200,
                  overflow: "auto",
                  fontSize: "0.75rem"
                }}
              >
                {stack}
              </Code>
            </Collapse>
          </Stack>
        )}
      </Stack>
    </Paper>
  )
}
