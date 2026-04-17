import type { StackProps, TextProps } from "@repo/mantine-ui"
import { Stack, Text } from "@repo/mantine-ui"

type TextWithLabelProps = {
  stackProps?: StackProps
  labelProps?: TextProps
  valueProps?: TextProps
}

export const TextWithLabel = ({
  label,
  value,
  stackProps,
  labelProps,
  valueProps
}: { label: string; value: string | React.ReactNode } & TextWithLabelProps) => {
  return (
    <Stack gap={0} {...stackProps}>
      <Text component="span" fz={"xs"} c="dimmed" {...labelProps}>
        {label}
      </Text>
      <Text component="span" fz="sm" lh={1} {...valueProps}>
        {value}
      </Text>
    </Stack>
  )
}
