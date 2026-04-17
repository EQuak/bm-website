"use client"

import { useRBAC } from "#/core/context/rbac/useRBAC"
import { useWorkspaceRouter } from "#/hooks/useWorkspaceRouter"

export default function DashboardPage() {
  const _ability = useRBAC()
  const _router = useWorkspaceRouter()
  return <div>Dashboard</div>
}
