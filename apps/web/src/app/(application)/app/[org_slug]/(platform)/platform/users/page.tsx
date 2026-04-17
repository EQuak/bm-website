import { api, HydrateClient } from "#/trpc/server"
import { MasterUsersListPage } from "./_components/MasterUsersListPage"

export default async function PlatformMasterUsersPage() {
  void (await api.platform.listMasterUsers.prefetch())

  return (
    <HydrateClient>
      <MasterUsersListPage />
    </HydrateClient>
  )
}
