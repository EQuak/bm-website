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
import { IconMail, IconShield, IconTools } from "@repo/mantine-ui/icons"
import { api } from "#/trpc/react"
import type { AppInstanceSettingsFormApi } from "./hooks/useAppInstanceSettingsForm"
import { useMaintenanceModeModal } from "./modals/MaintenanceModeModal"
import { useSecureModeModal } from "./modals/SecureModeModal"

type AppInstanceSettings = {
  hasEmailProvider: boolean
  [key: string]: unknown
}

export function AppInstanceOperationsCard({
  form,
  settings
}: {
  form: AppInstanceSettingsFormApi
  settings: AppInstanceSettings | null | undefined
}) {
  const utils = api.useUtils()
  const update = api.platform.appInstanceSettings.update.useMutation({
    onSuccess: () => {
      void utils.platform.appInstanceSettings.get.invalidate()
    }
  })

  const openSecureMode = useSecureModeModal()
  const openMaintenance = useMaintenanceModeModal()

  const handleEmailNotificationChange = (checked: boolean) => {
    update.mutate({ emailNotificationEnable: checked })
    notifications.show({
      title: "Email Notifications",
      message: `Email notifications ${checked ? "enabled" : "disabled"}`,
      color: "green"
    })
  }

  const handleMaintenanceModeChange = (checked: boolean) => {
    openMaintenance({
      target: checked,
      onConfirm: (v) => {
        form.setFieldValue("data.operations.maintenanceMode", v)
        update.mutate({ maintenanceMode: v })
        notifications.show({
          title: "Maintenance Mode",
          message: `Maintenance mode ${v ? "enabled" : "disabled"}`,
          color: "green"
        })
      }
    })
  }

  const handleSecureModeChange = (checked: boolean) => {
    openSecureMode({
      secureMode: !checked,
      onConfirm: (v) => {
        form.setFieldValue("data.operations.secureMode", v)
        update.mutate({ secureMode: v })
        notifications.show({
          title: "Secure Mode",
          message: `Secure mode ${v ? "enabled" : "disabled"}`,
          color: "green"
        })
      }
    })
  }

  const hasProvider = Boolean(settings?.hasEmailProvider)

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="md">
        <div>
          <Title order={3} mb="xs">
            Operations
          </Title>
          <Text c="dimmed" size="sm">
            Instance-wide behavior: maintenance, security, and whether outbound
            email is allowed (provider is configured below).
          </Text>
        </div>

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <form.Field name="data.operations.maintenanceMode">
              {(field) => (
                <Paper withBorder radius="md" p="md" h="100%">
                  <Group justify="space-between" mb="sm">
                    <Group gap="sm" wrap="nowrap">
                      <ThemeIcon size="lg" color="orange" variant="light">
                        <IconTools size={20} />
                      </ThemeIcon>
                      <Text fw={600} size="md">
                        Maintenance Mode
                      </Text>
                    </Group>
                    <Switch
                      checked={field.state.value}
                      onChange={(e) => {
                        handleMaintenanceModeChange(e.currentTarget.checked)
                      }}
                    />
                  </Group>
                  <Text c="dimmed" size="xs">
                    Put the application under maintenance
                  </Text>
                </Paper>
              )}
            </form.Field>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <form.Field name="data.operations.emailNotificationEnable">
              {(field) => (
                <Paper withBorder radius="md" p="md" h="100%">
                  <Group justify="space-between" mb="sm">
                    <Group gap="sm" wrap="nowrap">
                      <ThemeIcon size="lg" color="blue" variant="light">
                        <IconMail size={20} />
                      </ThemeIcon>
                      <Text fw={600} size="md">
                        Email Notifications
                      </Text>
                    </Group>
                    <Switch
                      checked={field.state.value}
                      disabled={!hasProvider}
                      onChange={(e) => {
                        field.handleChange(e.currentTarget.checked)
                        handleEmailNotificationChange(e.currentTarget.checked)
                      }}
                    />
                  </Group>
                  <Text c="dimmed" size="xs">
                    Allow sending email to users (requires provider below)
                  </Text>
                </Paper>
              )}
            </form.Field>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <form.Field name="data.operations.secureMode">
              {(field) => (
                <Paper withBorder radius="md" p="md" h="100%">
                  <Group justify="space-between" mb="sm">
                    <Group gap="sm" wrap="nowrap">
                      <ThemeIcon size="lg" color="green" variant="light">
                        <IconShield size={20} />
                      </ThemeIcon>
                      <Text fw={600} size="md">
                        Secure Mode
                      </Text>
                    </Group>
                    <Switch
                      checked={field.state.value}
                      onChange={(e) => {
                        handleSecureModeChange(e.currentTarget.checked)
                      }}
                    />
                  </Group>
                  <Text c="dimmed" size="xs">
                    Enhanced security (e.g. login restrictions)
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
