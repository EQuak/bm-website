"use client"

import {
  Grid,
  Group,
  notifications,
  Paper,
  Stack,
  Switch,
  Text,
  ThemeIcon,
  Title
} from "@repo/mantine-ui"
import { IconSettings } from "@repo/mantine-ui/icons"
import { api } from "#/trpc/react"
import type { SettingsFormApi } from "./hooks/useSettingsForm"

export function GeneralCard({ form }: { form: SettingsFormApi }) {
  const utils = api.useUtils()
  const update = api.system.settings.update.useMutation({
    onSuccess: () => {
      void utils.system.settings.get.invalidate()
    }
  })

  const handleGlobalNotificationChange = (checked: boolean) => {
    update.mutate({ globalNotificationEnable: checked })
    notifications.show({
      title: "Global notifications",
      message: `Global notifications ${checked ? "enabled" : "disabled"}`,
      color: "green"
    })
  }

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="md">
        <div>
          <Title order={3} mb="xs">
            General settings
          </Title>
          <Text c="dimmed" size="sm">
            Preferences for this workspace. Maintenance, email provider, and
            secure mode are under{" "}
            <Text span fw={600} inherit>
              Platform → App configuration
            </Text>{" "}
            (platform staff).
          </Text>
        </div>

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <form.Field name="data.general.globalNotificationEnable">
              {(field) => (
                <Paper withBorder radius="md" p="md" h="100%">
                  <Group justify="space-between" mb="sm">
                    <Group gap="sm" wrap="nowrap">
                      <ThemeIcon size="lg" color="gray" variant="light">
                        <IconSettings size={20} />
                      </ThemeIcon>
                      <Text fw={600} size="md">
                        Global notifications
                      </Text>
                    </Group>
                    <Switch
                      checked={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.currentTarget.checked)
                        handleGlobalNotificationChange(e.currentTarget.checked)
                      }}
                    />
                  </Group>
                  <Text c="dimmed" size="xs">
                    Master switch for notification delivery. Email still
                    requires Platform → App configuration (provider + email
                    toggle).
                  </Text>
                </Paper>
              )}
            </form.Field>
          </Grid.Col>
        </Grid>
      </Stack>
    </Paper>
  )
}
