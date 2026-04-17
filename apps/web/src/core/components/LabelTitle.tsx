"use client"

import type { TextProps } from "@repo/mantine-ui"
import {
  ActionIcon,
  CopyButton,
  Group,
  rem,
  Stack,
  Text,
  Tooltip
} from "@repo/mantine-ui"
import { IconCheck, IconCopy } from "@repo/mantine-ui/icons/index"
import { cn } from "@repo/mantine-ui/utils/cn"

import { formatPhoneNumber } from "#/utils/format_phone"

export function LabelWithTitle({
  label,
  value,
  isPhone = false,
  withCopy = false,
  valueProps,
  labelProps
}: {
  label: string
  labelProps?: Partial<TextProps>
  value: string
  valueProps?: Partial<TextProps>
  isPhone?: boolean
  withCopy?: boolean
}) {
  const displayValue = isPhone ? formatPhoneNumber(value) : value

  return (
    <Stack gap={0}>
      <Text fz={12} c="dimmed" {...labelProps}>
        {label}
      </Text>

      <CopyButton value={displayValue ?? ""} timeout={2000}>
        {({ copied, copy }) => (
          <Group gap={4} wrap="nowrap">
            <Text
              {...valueProps}
              className={cn([
                valueProps?.className ? valueProps.className : undefined,
                withCopy ? "cursor-pointer" : undefined
              ])}
              onClick={withCopy ? copy : undefined}
            >
              {displayValue}
            </Text>
            {withCopy && (
              <Tooltip
                label={copied ? "Copied" : "Copy"}
                withArrow
                position="right"
                bg="teal.2"
                c="teal.9"
              >
                <ActionIcon
                  color={copied ? "teal" : "gray"}
                  variant="subtle"
                  onClick={copy}
                  size={18}
                >
                  {copied ? (
                    <IconCheck style={{ width: rem(14) }} />
                  ) : (
                    <IconCopy style={{ width: rem(14) }} />
                  )}
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        )}
      </CopyButton>
    </Stack>
  )
}
