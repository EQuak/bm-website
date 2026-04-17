import { HydrateClient } from "#/trpc/server"
import UserRoleForm from "./_components/form/UserRoleForm"
import UserRoleList from "./_components/list/UserRolesList"

export default async function UserRolesPage({
  params
}: {
  params: Promise<{
    mode: ["create" | "view" | "list" | "edit", ...string[]]
  }>
}) {
  const mode = (await params).mode[0]
  const userRoleSlug = (await params).mode[1]!

  if (mode === "list") {
    return (
      <HydrateClient>
        <UserRoleList />
      </HydrateClient>
    )
  }

  return (
    <HydrateClient>
      <UserRoleForm mode={mode} userRoleSlug={userRoleSlug} />
    </HydrateClient>
  )
}
