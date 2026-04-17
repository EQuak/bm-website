"use client"

import { Stack, Text } from "@repo/mantine-ui"

import { TopPageWrapper } from "#/core/components/top-page-wrapper/TopPageWrapper"
import { AppInstanceEmailCard } from "./AppInstanceEmailCard"
import { AppInstanceOperationsCard } from "./AppInstanceOperationsCard"
import { useAppInstanceSettingsForm } from "./hooks/useAppInstanceSettingsForm"

export function AppInstanceSettingsPage() {
  const { form, settings } = useAppInstanceSettingsForm()

  return (
    <TopPageWrapper pageTitle="App configuration">
      <Stack gap="lg">
        <Text size="sm" c="dimmed">
          Instance-wide settings (maintenance, security, email). Not limited to
          the workspace slug in the URL.
        </Text>
        <AppInstanceOperationsCard form={form} settings={settings} />
        <AppInstanceEmailCard form={form} settings={settings} />
      </Stack>
    </TopPageWrapper>
  )
}
