import { Ionicons } from "@expo/vector-icons"
import type { RBAC } from "@repo/db/acl"
import type { ComponentType, ReactNode } from "react"

type IconRenderer = (props: { size?: number; color?: string }) => ReactNode

export type DropdownCategory = {
  slug: string
  name: string
  title: string
}

export type MenuItem = {
  label: string
  route: string
  component: ComponentType
  icon: IconRenderer
  isDropdown?: boolean
  categories?: DropdownCategory[]
  hasNotifications?: boolean
  permissions: RBAC["permissions"]
}

export type { IconRenderer }

// Menu configuration without importing screens to avoid circular dependencies
export const MENU_CONFIG = [
  {
    label: "Dashboard",
    route: "DashboardScreen",
    icon: (p: { size?: number; color?: string }) => (
      <Ionicons name="home-outline" {...p} />
    ),
    permissions: [
      {
        permission: "dashboard",
        actions: ["view"]
      }
    ]
  }
]
