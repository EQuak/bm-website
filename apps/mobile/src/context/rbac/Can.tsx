import type { ReactNode } from "react"
import { useRBAC } from "./useRBAC"

interface CanProps {
  action: string | string[]
  subject: string
  children: ReactNode
  fallback?: ReactNode
}

/**
 * @component Can
 * @description Mobile-friendly component for conditional rendering based on RBAC permissions
 *
 * @example
 * <Can action="view" subject="employees">
 *   <Text>This text is only visible to users who can view employees</Text>
 * </Can>
 *
 * <Can action="edit" subject="projects" fallback={<Text>No permission</Text>}>
 *   <Button title="Edit Project" />
 * </Can>
 */
export function Can({ action, subject, children, fallback = null }: CanProps) {
  const ability = useRBAC()

  if (ability.can(action, subject)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
