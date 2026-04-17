"use client"

import { Alert, Group, modals, Stack, Text, ThemeIcon } from "@repo/mantine-ui"
import { IconAlertTriangle } from "@repo/mantine-ui/icons"

export function useSecureModeModal() {
  return function open({
    secureMode,
    onConfirm
  }: {
    secureMode: boolean
    onConfirm: (target: boolean) => void
  }) {
    const target = !secureMode
    const color = target ? "red" : "blue"
    modals.openConfirmModal({
      title: (
        <Group gap="sm">
          <ThemeIcon size="lg" color={color} variant="light">
            <IconAlertTriangle size={18} />
          </ThemeIcon>
          <Text fz="lg" fw={600}>
            {target ? "Enable Secure Mode" : "Disable Secure Mode"}
          </Text>
        </Group>
      ),
      children: (
        <Stack gap="md">
          <Alert
            icon={<IconAlertTriangle size={16} />}
            color={color}
            variant="light"
          >
            <Text fz="sm" fw={500}>
              {target
                ? "All users will be logged out and login will be temporarily disabled."
                : "Secure mode will be disabled, and normal login will resume."}
            </Text>
          </Alert>
          <Text fz="sm" c="dimmed">
            You can toggle this setting again at any time.
          </Text>
        </Stack>
      ),
      onConfirm: () => {
        modals.closeAll()
      },
      onCancel: () => {
        onConfirm(target)
        modals.closeAll()
      },
      labels: {
        confirm: target ? "Keep Disabled" : "Keep Enabled",
        cancel: target ? "Enable Secure Mode" : "Disable Secure Mode"
      },
      confirmProps: { variant: "light" },
      cancelProps: {
        color,
        variant: "filled",
        leftSection: <IconAlertTriangle size={14} />
      },
      centered: true,
      size: "md"
    })
  }
}
