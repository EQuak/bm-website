import { api, HydrateClient } from "#/trpc/server"
import DeveloperToolsContent from "./_components/DeveloperToolsContent"

export default async function PlatformDeveloperToolsPage() {
  const access = await api.platform.getAccess()
  void (await api.platform.profilesForImpersonationPicker.prefetch())

  return (
    <HydrateClient>
      <DeveloperToolsContent realUserId={access.userId} />
    </HydrateClient>
  )
}
