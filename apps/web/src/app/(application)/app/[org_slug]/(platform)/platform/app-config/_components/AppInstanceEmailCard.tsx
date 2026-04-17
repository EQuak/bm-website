"use client"

import {
  Button,
  Grid,
  Group,
  NumberInput,
  notifications,
  Paper,
  Stack,
  Switch,
  Text,
  TextInput,
  Title
} from "@repo/mantine-ui"
import {
  IconKey,
  IconLock,
  IconMail,
  IconServer,
  IconWorld
} from "@repo/mantine-ui/icons"
import { api } from "#/trpc/react"
import { FieldLabel } from "./FieldLabel"
import type { AppInstanceSettingsFormApi } from "./hooks/useAppInstanceSettingsForm"
import { useClearApiKeyModal } from "./modals/ClearApiKeyModal"

type AppInstanceSettings = {
  hasEmailProvider: boolean
  resendApiKeyPreview: string | null
  [key: string]: unknown
}

export function AppInstanceEmailCard({
  form,
  settings
}: {
  form: AppInstanceSettingsFormApi
  settings: AppInstanceSettings | null | undefined
}) {
  const utils = api.useUtils()
  const update = api.platform.appInstanceSettings.update.useMutation({
    onSuccess: () => {
      notifications.show({
        title: "Email Provider",
        message: "Email provider configured successfully",
        color: "green"
      })
      void utils.platform.appInstanceSettings.get.invalidate()
    }
  })

  const onSave = () => {
    const payload: Record<string, unknown> = {}

    const emailFields = [
      "resendEnabled",
      "resendFromEmail",
      "resendDomain",
      "resendSmtpHost",
      "resendSmtpPort",
      "resendSmtpUser",
      "resendSmtpPass",
      "resendRateLimit"
    ] as const

    emailFields.forEach((field) => {
      const fieldPath = `data.email.${field}` as const
      const fieldState = form.getFieldMeta(fieldPath)

      if (fieldState?.isDirty) {
        const value = form.getFieldValue(fieldPath)
        payload[field] = value
      }
    })

    const apiKeyState = form.getFieldMeta("data.email.resendApiKey")
    if (apiKeyState?.isDirty) {
      const key = (form.getFieldValue("data.email.resendApiKey") || "").trim()
      const isPreview =
        key.includes("*") ||
        (settings?.resendApiKeyPreview
          ? key === settings.resendApiKeyPreview
          : false)

      if (key && !isPreview) {
        payload.resendApiKey = key
      }
    }

    if (Object.keys(payload).length === 0) {
      notifications.show({
        title: "Nothing to save",
        message: "No changes detected",
        color: "gray"
      })
      return
    }
    update.mutate(payload)
  }

  const openClearApiKey = useClearApiKeyModal()

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="xs">
        <div>
          <Title order={3} mb="xs">
            Email provider
          </Title>
          <Text c="dimmed" size="sm">
            Resend / SMTP for the whole application (single instance config).
          </Text>
        </div>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <form.Field name="data.email.resendFromEmail">
              {(field) => (
                <TextInput
                  label={
                    <FieldLabel
                      text="From Email"
                      hint="Sender used for outgoing emails"
                    />
                  }
                  placeholder="noreply@yourdomain.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.currentTarget.value)}
                  leftSection={<IconMail size={16} />}
                />
              )}
            </form.Field>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <form.Field name="data.email.resendDomain">
              {(field) => (
                <TextInput
                  label={
                    <FieldLabel
                      text="Resend Domain"
                      hint="Custom domain on Resend"
                    />
                  }
                  placeholder="mail.yourdomain.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.currentTarget.value)}
                  leftSection={<IconWorld size={16} />}
                />
              )}
            </form.Field>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <form.Field name="data.email.resendSmtpHost">
              {(field) => (
                <TextInput
                  label={
                    <FieldLabel text="SMTP Host" hint="Only if using SMTP" />
                  }
                  placeholder="smtp.gmail.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.currentTarget.value)}
                  leftSection={<IconServer size={16} />}
                />
              )}
            </form.Field>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <form.Field name="data.email.resendSmtpPort">
              {(field) => (
                <NumberInput
                  label={
                    <FieldLabel
                      text="SMTP Port"
                      hint="587 (TLS) or 465 (SSL)"
                    />
                  }
                  placeholder="587"
                  value={field.state.value}
                  onChange={(v) => {
                    if (typeof v === "number") field.handleChange(v)
                  }}
                  min={1}
                  max={65535}
                />
              )}
            </form.Field>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <form.Field name="data.email.resendSmtpUser">
              {(field) => (
                <TextInput
                  label={<FieldLabel text="SMTP User" hint="SMTP username" />}
                  placeholder="smtp-user@domain.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.currentTarget.value)}
                  leftSection={<IconKey size={16} />}
                />
              )}
            </form.Field>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <form.Field name="data.email.resendSmtpPass">
              {(field) => (
                <TextInput
                  label={
                    <FieldLabel
                      text="SMTP Password"
                      hint="Leave empty to keep current"
                    />
                  }
                  placeholder="••••••••"
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.currentTarget.value)}
                  leftSection={<IconLock size={16} />}
                />
              )}
            </form.Field>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <form.Field name="data.email.resendRateLimit">
              {(field) => (
                <NumberInput
                  label={
                    <FieldLabel
                      text="Rate Limit (emails/sec)"
                      hint="Controls throughput"
                    />
                  }
                  placeholder="2"
                  value={field.state.value}
                  onChange={(v) => {
                    if (typeof v === "number") field.handleChange(v)
                  }}
                  min={1}
                  max={20}
                />
              )}
            </form.Field>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <form.Field name="data.email.resendApiKey">
              {(field) => (
                <TextInput
                  label={
                    <FieldLabel
                      text="API Key"
                      hint="Only change this field to update the key"
                    />
                  }
                  placeholder="re_123abc..."
                  value={
                    field.state.value || (settings?.resendApiKeyPreview ?? "")
                  }
                  onFocus={() => {
                    if (!field.state.value) {
                      field.handleChange("")
                    }
                  }}
                  onChange={(e) => field.handleChange(e.currentTarget.value)}
                  leftSection={<IconLock size={16} />}
                />
              )}
            </form.Field>
          </Grid.Col>
        </Grid>

        <Group justify="space-between">
          <Button
            variant="outline"
            color="red"
            onClick={() =>
              openClearApiKey({
                onConfirm: () => update.mutate({ clearApiKey: true })
              })
            }
          >
            Clear API Key
          </Button>
          <Group>
            <form.Field name="data.email.resendEnabled">
              {(field) => (
                <Switch
                  checked={field.state.value}
                  label="Enable provider"
                  onChange={(e) => field.handleChange(e.currentTarget.checked)}
                />
              )}
            </form.Field>
            <Button onClick={onSave}>Save Changes</Button>
          </Group>
        </Group>
      </Stack>
    </Paper>
  )
}
