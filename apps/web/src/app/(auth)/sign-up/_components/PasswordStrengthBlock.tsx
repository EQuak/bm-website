"use client"

import type { PasswordInputProps } from "@repo/mantine-ui"
import { Group, PasswordInput, Progress, Stack, Text } from "@repo/mantine-ui"
import { IconCheck, IconX } from "@repo/mantine-ui/icons/index"

export const PASSWORD_RULES = [
  {
    key: "len",
    label: "At least 8 characters",
    test: (p: string) => p.length >= 8
  },
  {
    key: "lower",
    label: "One lowercase letter",
    test: (p: string) => /[a-z]/.test(p)
  },
  {
    key: "upper",
    label: "One uppercase letter",
    test: (p: string) => /[A-Z]/.test(p)
  },
  {
    key: "num",
    label: "One number",
    test: (p: string) => /[0-9]/.test(p)
  }
] as const

export function getPasswordStrength(password: string) {
  const met = PASSWORD_RULES.map((rule) => ({
    ...rule,
    met: rule.test(password)
  }))
  const metCount = met.filter((r) => r.met).length
  const total = PASSWORD_RULES.length
  const score = (metCount / total) * 100
  const allMet = metCount === total
  return { met, metCount, total, score, allMet }
}

/**
 * Password field with requirement checklist and segmented strength meter:
 * segments stay short/red until each rule is met; full green when all pass.
 */
export function PasswordStrengthBlock(props: PasswordInputProps) {
  const password =
    typeof props.value === "string" ? props.value : String(props.value ?? "")
  const { met, allMet } = getPasswordStrength(password)
  const hasInput = password.length > 0

  return (
    <Stack gap="xs">
      <PasswordInput {...props} />

      <Stack gap={6}>
        <Group gap={6} grow>
          {met.map((rule, index) => (
            <Progress
              key={rule.key}
              size={4}
              radius="xs"
              value={rule.met ? 100 : 0}
              color={rule.met ? "green" : hasInput ? "red" : "gray.3"}
              styles={{
                section: { transitionDuration: "150ms" }
              }}
              aria-label={`Requirement ${index + 1} of ${met.length}: ${rule.label}`}
            />
          ))}
        </Group>

        <Stack gap={4}>
          {met.map((rule) => (
            <Group key={rule.key} gap={8} wrap="nowrap">
              {rule.met ? (
                <IconCheck size={16} stroke={2} className="text-green-600" />
              ) : (
                <IconX
                  size={16}
                  stroke={2}
                  className={hasInput ? "text-red-500" : "text-mtn-gray-5"}
                />
              )}
              <Text
                component="span"
                size="sm"
                c={rule.met ? "green.7" : hasInput ? "red.7" : "dimmed"}
              >
                {rule.label}
              </Text>
            </Group>
          ))}
        </Stack>

        {hasInput ? (
          <Text size="xs" fw={600} c={allMet ? "green.7" : "red.7"}>
            {allMet
              ? "Password meets all requirements."
              : "Complete the requirements above to continue."}
          </Text>
        ) : null}
      </Stack>
    </Stack>
  )
}
