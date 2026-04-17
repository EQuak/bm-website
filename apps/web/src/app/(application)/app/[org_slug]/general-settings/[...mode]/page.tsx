"use client"

import { Stack, Title } from "@repo/mantine-ui"
import { GeneralCard } from "./_components/GeneralCard"
import { useSettingsForm } from "./_components/hooks/useSettingsForm"

export default function GeneralSettingsPage() {
  const { form } = useSettingsForm()

  return (
    <Stack>
      <Title order={3}>General settings</Title>
      <GeneralCard form={form} />
    </Stack>
  )
}
