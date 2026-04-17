import { useRBAC } from "./useRBAC"

/**
 * @hook useCan
 * @description Hook for checking RBAC permissions in mobile components
 *
 * @param action - The action to check (e.g., "view", "edit", "add")
 * @param subject - The subject/module to check (e.g., "employees", "projects")
 * @returns boolean indicating if the user can perform the action
 *
 * @example
 * const canViewEmployees = useCan("view", "employees")
 * const canEditProjects = useCan("edit", "projects")
 */
export function useCan(action: string | string[], subject: string): boolean {
  const ability = useRBAC()
  return ability.can(action, subject)
}
