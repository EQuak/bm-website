"use client"

import { Alert, Group, modals, Stack, Text, ThemeIcon } from "@repo/mantine-ui"
import { IconAlertTriangle } from "@repo/mantine-ui/icons"

export function useClearApiKeyModal() {
  return function open({ onConfirm }: { onConfirm: () => void }) {
    modals.openConfirmModal({
      title: (
        <Group gap="sm">
          <ThemeIcon size="lg" color="red" variant="light">
            <IconAlertTriangle size={18} />
          </ThemeIcon>
          <Text fz="lg" fw={600}>
            Clear API Key
          </Text>
        </Group>
      ),
      children: (
        <Stack gap="md">
          <Alert
            icon={<IconAlertTriangle size={16} />}
            color="red"
            variant="light"
          >
            <Text fz="sm" fw={500}>
              This action will remove the API key and disable email sending.
            </Text>
          </Alert>
          <Text fz="sm" c="dimmed">
            You can set a new API key later to re-enable email.
          </Text>
        </Stack>
      ),
      onConfirm: () => {
        modals.closeAll()
      },
      onCancel: onConfirm,
      labels: { confirm: "Keep Key", cancel: "Clear API Key" },
      confirmProps: { variant: "light" },
      cancelProps: {
        color: "red",
        variant: "filled",
        leftSection: <IconAlertTriangle size={14} />
      },
      centered: true,
      size: "md"
    })
  }
}
