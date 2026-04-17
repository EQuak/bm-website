import { api, HydrateClient } from "#/trpc/server"

export default async function ProfileLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ org_slug: string }>
}) {
  const { org_slug } = await params
  const { organizationId } =
    await api.organizations.resolveMemberOrganizationId({
      organizationSlug: org_slug
    })
  await api.profiles.getProfileByUserLogged.prefetch({ organizationId })

  return <HydrateClient>{children}</HydrateClient>
}
