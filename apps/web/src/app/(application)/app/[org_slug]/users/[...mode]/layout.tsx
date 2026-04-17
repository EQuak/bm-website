import { api, HydrateClient } from "#/trpc/server"

export default async function UsersLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{
    org_slug: string
    mode: string[]
  }>
}) {
  const { org_slug, mode } = await params
  const profileId = mode[1]

  const { organizationId } =
    await api.organizations.resolveMemberOrganizationId({
      organizationSlug: org_slug
    })

  const prefetches: Promise<unknown>[] = [
    api.aclsRoles.getAllAclsRoles.prefetch(),
    api.profiles.getPendingInviteProfiles.prefetch({ organizationId })
  ]

  if (profileId) {
    prefetches.push(
      api.profiles.getProfileById.prefetch({ id: profileId, organizationId })
    )
  }

  await Promise.all(prefetches)

  return <HydrateClient>{children}</HydrateClient>
}
