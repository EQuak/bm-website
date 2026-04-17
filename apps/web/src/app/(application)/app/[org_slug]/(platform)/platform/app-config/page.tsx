import { api, HydrateClient } from "#/trpc/server"
import { AppInstanceSettingsPage } from "./_components/AppInstanceSettingsPage"

export default async function PlatformAppConfigPage() {
  void (await api.platform.appInstanceSettings.get.prefetch())

  return (
    <HydrateClient>
      <AppInstanceSettingsPage />
    </HydrateClient>
  )
}
