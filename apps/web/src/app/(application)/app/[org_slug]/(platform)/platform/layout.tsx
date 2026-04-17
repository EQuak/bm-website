import { redirect } from "next/navigation"

import { workspaceDashboardPath } from "#/core/config/routes"
import { api } from "#/trpc/server"

/**
 * Platform (internal staff) routes under `/app/[org_slug]/platform/*`.
 */
export default async function PlatformModuleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ org_slug: string }>
}) {
  const { org_slug } = await params
  const access = await api.platform.getAccess()

  if (!access.isPlatformStaff) {
    redirect(workspaceDashboardPath(org_slug))
  }

  return <>{children}</>
}
