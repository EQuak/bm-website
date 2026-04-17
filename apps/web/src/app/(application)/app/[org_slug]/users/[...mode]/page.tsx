import { api } from "#/trpc/server"
import UserInviteForm from "./_components/invite-form/UserInviteForm"
import UsersListPage from "./_components/list/UsersList"

export default async function UsersPage({
  params
}: {
  params: Promise<{
    org_slug: string
    mode: string[]
  }>
}) {
  const resolvedParams = await params
  const { org_slug } = resolvedParams
  const mode = resolvedParams.mode[0] as "invite" | "list"

  const { organizationId } =
    await api.organizations.resolveMemberOrganizationId({
      organizationSlug: org_slug
    })

  if (mode === "invite") {
    return <UserInviteForm organizationId={organizationId} />
  }

  // Handle "my-profile" mode by getting the logged-in user's profile ID
  // if (mode === "my-profile") {
  //   const profile = await api.profiles.getProfileByUserLogged({ organizationId })
  //   profileId = profile?.id
  //   // Render as "view" mode for my-profile
  //   return <ViewUserForm profileId={profileId!} mode="view" />
  // }

  // if (mode === "view" || mode === "edit") {
  //   return <ViewUserForm profileId={profileId!} mode={mode} />
  // }

  return <UsersListPage organizationId={organizationId} />
}
