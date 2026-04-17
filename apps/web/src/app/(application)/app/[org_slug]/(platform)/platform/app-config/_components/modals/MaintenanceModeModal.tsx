"use client"

import { Alert, Group, modals, Stack, Text, ThemeIcon } from "@repo/mantine-ui"
import { IconAlertTriangle } from "@repo/mantine-ui/icons"

export function useMaintenanceModeModal() {
  return function open({
    target,
    onConfirm
  }: {
    target: boolean
    onConfirm: (target: boolean) => void
  }) {
    modals.openConfirmModal({
      title: (
        <Group gap="sm">
          <ThemeIcon
            size="lg"
            color={target ? "yellow" : "green"}
            variant="light"
          >
            <IconAlertTriangle size={18} />
          </ThemeIcon>
          <Text fz="lg" fw={600}>
            {target ? "Enable Maintenance Mode" : "Disable Maintenance Mode"}
          </Text>
        </Group>
      ),
      children: (
        <Stack gap="md">
          <Alert
            icon={<IconAlertTriangle size={16} />}
            color={target ? "yellow" : "green"}
            variant="light"
          >
            <Text fz="sm" fw={500}>
              {target
                ? "The application will be in maintenance. Some features may be unavailable."
                : "The application will return to normal operation."}
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
        confirm: target ? "Keep Normal" : "Keep Maintenance",
        cancel: target ? "Enable Maintenance" : "Disable Maintenance"
      },
      confirmProps: { variant: "light" },
      cancelProps: {
        color: target ? "yellow" : "green",
        variant: "filled",
        leftSection: <IconAlertTriangle size={14} />
      },
      centered: true,
      size: "md"
    })
  }
}
