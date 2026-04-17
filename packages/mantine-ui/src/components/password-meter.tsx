import type { PasswordInputProps } from "@mantine/core"
import {
  Box,
  Button,
  Center,
  Collapse,
  Group,
  PasswordInput,
  Progress,
  Stack,
  Text
} from "@mantine/core"
import { IconCheck, IconX } from "@tabler/icons-react"
import type { FC } from "react"
import { useState } from "react"

interface PasswordRequirement {
  re: RegExp
  label: string
}

interface PasswordStrengthProps extends PasswordInputProps {
  requirements?: {
    number?: boolean
    upper?: boolean
    lower?: boolean
    symbol?: boolean
    length?: number
  }
}

function PasswordRequirement({
  meets,
  label
}: {
  meets: boolean
  label: string
}) {
  return (
    <Text component="div" c={meets ? "teal" : "red"} mt={5} size="sm">
      <Center inline>
        {meets ? (
          <IconCheck size="0.9rem" stroke={1.5} />
        ) : (
          <IconX size="0.9rem" stroke={1.5} />
        )}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  )
}

function getRequirements(
  customRequirements: PasswordStrengthProps["requirements"]
) {
  const defaultRequirements = {
    number: true,
    upper: false,
    lower: true,
    symbol: false,
    length: 6
  }
  const mergedRequirements = { ...defaultRequirements, ...customRequirements }

  const requirements: PasswordRequirement[] = []

  if (mergedRequirements.number) {
    requirements.push({ re: /[0-9]/, label: "Includes number" })
  }
  if (mergedRequirements.lower) {
    requirements.push({ re: /[a-z]/, label: "Includes lowercase letter" })
  }
  if (mergedRequirements.upper) {
    requirements.push({ re: /[A-Z]/, label: "Includes uppercase letter" })
  }
  if (mergedRequirements.symbol) {
    requirements.push({
      re: /[$&+,:;=?@#|'<>.^*()%!-]/,
      label: "Includes special symbol"
    })
  }

  return { requirements, minLength: mergedRequirements.length }
}

function getStrength(
  password: string,
  requirements: PasswordRequirement[],
  minLength: number
) {
  let multiplier = password.length > minLength ? 0 : 1

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1
    }
  })

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0)
}

export const PasswordMeter: FC<PasswordStrengthProps> = ({
  requirements: customRequirements,
  ...props
}) => {
  const { requirements, minLength } = getRequirements(customRequirements)
  const strength = getStrength(props.value as string, requirements, minLength)
  const [viewRequirements, setViewRequirements] = useState(false)

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(props.value as string)}
    />
  ))

  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ section: { transitionDuration: "0ms" } }}
        value={
          (props.value as string).length > 0 && index === 0
            ? 100
            : strength >= ((index + 1) / 4) * 100
              ? 100
              : 0
        }
        color={strength > 80 ? "teal" : strength > 50 ? "yellow" : "red"}
        key={index}
        size={4}
      />
    ))

  return (
    <div className="w-full">
      <PasswordInput
        {...props}
        onFocus={(e) => {
          setViewRequirements(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setViewRequirements(false)
          props.onBlur?.(e)
        }}
        styles={{
          label: {
            width: "100%"
          },
          ...props.styles
        }}
        label={
          <Group justify="space-between">
            {props.label}
            <Button
              size="compact-xs"
              variant="subtle"
              onClick={() => setViewRequirements((prev) => !prev)}
            >
              {viewRequirements ? "Hide" : "View"} Requirements
            </Button>
          </Group>
        }
      />

      <Group gap={5} grow mt="xs" mb="md">
        {bars}
      </Group>

      <Collapse in={viewRequirements}>
        <Stack gap={6}>
          <PasswordRequirement
            label={`Has at least ${minLength} characters`}
            meets={(props.value as string).length >= minLength}
          />
          {checks}
        </Stack>
      </Collapse>
    </div>
  )
}
