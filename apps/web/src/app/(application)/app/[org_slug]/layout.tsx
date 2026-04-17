import { redirect } from "next/navigation"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { workspaceDashboardPath } from "#/core/config/routes"
import { AppProvider } from "#/core/context/AppContext"
import { AbilityProvider } from "#/core/context/rbac/AbilityProvider"
import { ThemeStoreProvider } from "#/providers/theme-store-provider"
import { api, HydrateClient } from "#/trpc/server"
import { WorkspaceShell } from "./_components/shell"

export default async function WorkspaceLayout({
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
  if (!profile) redirect("/login?error=no_profile")

  const expectedSlug = profile._organization?.slug
  if (!expectedSlug || org_slug !== expectedSlug) {
    redirect(workspaceDashboardPath(expectedSlug ?? "default"))
  }

  void (await api.profiles.getProfileByUserLogged.prefetch({ organizationId }))
  void (await api.platform.getAccess.prefetch())

  return (
    <HydrateClient>
      <AppProvider orgSlug={org_slug} organizationId={organizationId}>
        <ThemeStoreProvider>
          <NuqsAdapter>
            <AbilityProvider>
              <WorkspaceShell>{children}</WorkspaceShell>
            </AbilityProvider>
          </NuqsAdapter>
        </ThemeStoreProvider>
      </AppProvider>
    </HydrateClient>
  )
}
