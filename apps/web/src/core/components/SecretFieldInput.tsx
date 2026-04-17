"use client"

import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Tooltip
} from "@repo/mantine-ui"
import { IconCheck, IconEdit, IconTrash, IconX } from "@repo/mantine-ui/icons"
import { type ReactNode, useState } from "react"

type SecretFieldState = "empty" | "configured" | "editing"

interface SecretFieldInputProps {
  label: ReactNode
  hint?: string
  isConfigured: boolean
  placeholder?: string
  onSave: (value: string) => void
  onRemove?: () => void
  disabled?: boolean
  showAsPassword?: boolean
  removeConfirmMessage?: string
}

export function SecretFieldInput({
  label,
  hint,
  isConfigured,
  placeholder = "Enter value...",
  onSave,
  onRemove,
  disabled = false,
  showAsPassword = true,
  removeConfirmMessage = "Are you sure you want to remove this credential?"
}: SecretFieldInputProps) {
  const [state, setState] = useState<SecretFieldState>(
    isConfigured ? "configured" : "empty"
  )
  const [inputValue, setInputValue] = useState("")

  const handleStartEditing = () => {
    setInputValue("")
    setState("editing")
  }

  const handleCancel = () => {
    setInputValue("")
    setState(isConfigured ? "configured" : "empty")
  }

  const handleSave = () => {
    if (inputValue.trim()) {
      onSave(inputValue.trim())
      setInputValue("")
      setState("configured")
    }
  }

  const handleRemove = () => {
    if (onRemove && window.confirm(removeConfirmMessage)) {
      onRemove()
      setInputValue("")
      setState("empty")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  const InputComponent = showAsPassword ? PasswordInput : TextInput

  const renderLabel = () => (
    <Stack gap={2}>
      <Text size="sm" fw={500}>
        {label}
      </Text>
      {hint && (
        <Text size="xs" c="dimmed">
          {hint}
        </Text>
      )}
    </Stack>
  )

  if (state === "configured") {
    return (
      <Stack gap={4}>
        {renderLabel()}
        <Paper withBorder p="xs" bg="gray.0">
          <Group justify="space-between">
            <Badge
              color="green"
              variant="light"
              leftSection={<IconCheck size={12} />}
            >
              Configured
            </Badge>
            <Group gap="xs">
              <Tooltip label="Change value">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={handleStartEditing}
                  disabled={disabled}
                >
                  <IconEdit size={16} />
                </ActionIcon>
              </Tooltip>
              {onRemove && (
                <Tooltip label="Remove credential">
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={handleRemove}
                    disabled={disabled}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
          </Group>
        </Paper>
      </Stack>
    )
  }

  if (state === "editing") {
    return (
      <Stack gap={4}>
        {renderLabel()}
        <Group gap="xs" align="flex-start">
          <InputComponent
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            style={{ flex: 1 }}
            autoFocus
          />
          <Tooltip label="Save">
            <ActionIcon
              variant="filled"
              color="green"
              onClick={handleSave}
              disabled={disabled || !inputValue.trim()}
              size="lg"
            >
              <IconCheck size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Cancel">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={handleCancel}
              disabled={disabled}
              size="lg"
            >
              <IconX size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Text size="xs" c="dimmed">
          Press Enter to save, Escape to cancel
        </Text>
      </Stack>
    )
  }

  return (
    <Stack gap={4}>
      {renderLabel()}
      <Group gap="xs" align="flex-start">
        <InputComponent
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          style={{ flex: 1 }}
        />
        <Button
          onClick={handleSave}
          disabled={disabled || !inputValue.trim()}
          size="sm"
        >
          Set
        </Button>
      </Group>
    </Stack>
  )
}
