import { redirect } from "next/navigation"

import { workspaceDashboardPath } from "#/core/config/routes"
import { api } from "#/trpc/server"

/**
 * `/app` — resolve the signed-in user's organization and send them to the workspace.
 */
export default async function AppEntryRedirect() {
  const profile = await api.profiles.getSessionWorkspace()
  if (!profile) redirect("/login?error=no_profile")
  const slug = profile._organization?.slug ?? "default"
  redirect(workspaceDashboardPath(slug))
}
