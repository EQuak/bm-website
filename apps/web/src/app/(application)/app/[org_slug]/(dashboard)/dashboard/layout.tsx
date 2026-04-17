export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  // const profile = await api.profiles.getProfileByUserLogged()
  // if (!profile) redirect("/login")

  // const ability = userAbility({
  //   aclRole: {
  //     roleSlug: profile.aclRole,
  //     permissions: profile._aclRole._permissions ?? []
  //   },
  //   aclCustomPermissions: profile.aclCustomPermissions ?? []
  // })

  //   if (!ability.can("view", "dashboard")) unauthorized()

  return <>{children}</>
}
