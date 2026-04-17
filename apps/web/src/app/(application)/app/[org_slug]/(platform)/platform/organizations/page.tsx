import { api, HydrateClient } from "#/trpc/server"
import { OrganizationsListPage } from "./_components/OrganizationsListPage"

export default async function PlatformOrganizationsPage() {
  void (await api.platform.listOrganizations.prefetch())

  return (
    <HydrateClient>
      <OrganizationsListPage />
    </HydrateClient>
  )
}
