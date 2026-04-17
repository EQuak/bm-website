import { api, HydrateClient } from "#/trpc/server"

export default async function GeneralSettingsLayout({
  children
}: {
  children: React.ReactNode
}) {
  void (await api.system.settings.get.prefetch())

  return <HydrateClient>{children}</HydrateClient>
}
