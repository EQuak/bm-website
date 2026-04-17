import { redirect, unauthorized } from "next/navigation"

import { userAbility } from "#/core/context/rbac/ability"
import { api, HydrateClient } from "#/trpc/server"

export default async function SettingsLayout({
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
  const profile = await api.profiles.getProfileByUserLogged({ organizationId })

  if (!profile) redirect("/login")

  const ability = userAbility({
    aclRole: {
      roleSlug: profile.aclRole,
      permissions: profile._aclRole._permissions ?? []
    },
    aclCustomPermissions: profile.aclCustomPermissions ?? []
  })

  if (!ability.can("view", "settings")) unauthorized()

  return <HydrateClient>{children}</HydrateClient>
}
