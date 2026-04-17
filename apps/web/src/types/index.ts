import type { RBAC } from "@repo/db/acl"

export type NavItems = {
  label: string
  href: string
  icon?: React.FC
  permissions: RBAC["permissions"]
  isBeta?: boolean
  notifications?: () => React.ReactNode | null
  disabled?: boolean
  /** If true, only users with Supabase `app_metadata.platform_staff` see this link. */
  platformStaffOnly?: boolean
  links?: NavItems[]
}
