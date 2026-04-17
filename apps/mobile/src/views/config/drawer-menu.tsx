import { Ionicons } from "@expo/vector-icons"
import type { RBAC } from "@repo/db/acl"
import type { ReactNode } from "react"

export type IconRenderer = (props: {
  size?: number
  color?: string
}) => ReactNode

export type PermissionRequirement = RBAC["permissions"][number]

export type DrawerMenuItem = {
  label: string
  href: string
  icon?: IconRenderer
  permissions: PermissionRequirement[]
  links?: DrawerMenuItem[]
  hasNotifications?: boolean
  /** Requires Supabase app_metadata.platform_staff */
  platformStaffOnly?: boolean
}

/** Aligned with web `siteConfig.mainNav` and template ACL (`dashboard`, `settings`, `settings-user-roles`). */
export const DRAWER_MENU: DrawerMenuItem[] = [
  {
    label: "Dashboard",
    href: "/app",
    icon: (p) => <Ionicons name="home-outline" {...p} />,
    permissions: [{ permission: "dashboard", actions: ["view"] }]
  },
  {
    label: "Platform",
    href: "/app/settings/platform",
    icon: (p) => <Ionicons name="shield-outline" {...p} />,
    permissions: [],
    platformStaffOnly: true,
    links: [
      {
        label: "Overview",
        href: "/app/settings/platform",
        icon: (p) => <Ionicons name="grid-outline" {...p} />,
        permissions: []
      },
      {
        label: "Organizations",
        href: "/app/settings/platform/organizations",
        icon: (p) => <Ionicons name="business-outline" {...p} />,
        permissions: []
      },
      {
        label: "All users",
        href: "/app/settings/platform/users",
        icon: (p) => <Ionicons name="people-outline" {...p} />,
        permissions: []
      },
      {
        label: "Developer tools",
        href: "/app/settings/platform/developer-tools",
        icon: (p) => <Ionicons name="code-slash-outline" {...p} />,
        permissions: []
      },
      {
        label: "App configuration",
        href: "/app/settings/platform/app-config",
        icon: (p) => <Ionicons name="options-outline" {...p} />,
        permissions: []
      }
    ]
  },
  {
    label: "Settings",
    href: "/app/settings",
    icon: (p) => <Ionicons name="settings-outline" {...p} />,
    permissions: [{ permission: "settings", actions: ["view"] }],
    links: [
      {
        label: "Profile",
        href: "/app/my-profile",
        icon: (p) => <Ionicons name="person-outline" {...p} />,
        permissions: []
      },
      {
        label: "User Roles",
        href: "/app/settings/user-roles",
        icon: (p) => <Ionicons name="shield-outline" {...p} />,
        permissions: [{ permission: "settings-user-roles", actions: ["view"] }]
      },
      {
        label: "General Settings",
        href: "/app/settings/general",
        icon: (p) => <Ionicons name="options-outline" {...p} />,
        permissions: []
      }
    ]
  }
]
