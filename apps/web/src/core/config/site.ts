import {
  IconAdjustments,
  IconBuilding,
  IconCode,
  IconHome,
  IconSettings,
  IconShield,
  IconUsers
} from "@repo/mantine-ui/icons"
import type { NavItems } from "#/types"

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  mainNav: NavItems[]
  betaNav?: NavItems[]
}

export const siteConfig: SiteConfig = {
  name: "App Template",
  description: "",
  url: "",
  ogImage: "",
  mainNav: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: IconHome,
      permissions: []
    },
    {
      label: "Users",
      href: "/users/list",
      icon: IconUsers,
      permissions: [
        {
          permission: "users",
          actions: ["view"]
        }
      ]
    },
    {
      label: "Platform",
      href: "/platform",
      icon: IconShield,
      permissions: [],
      platformStaffOnly: true,
      links: [
        {
          label: "Overview",
          href: "/platform",
          permissions: []
        },
        {
          label: "Organizations",
          href: "/platform/organizations",
          icon: IconBuilding,
          permissions: []
        },
        {
          label: "All users",
          href: "/platform/users",
          icon: IconUsers,
          permissions: []
        },
        {
          label: "Developer tools",
          href: "/platform/developer-tools",
          icon: IconCode,
          permissions: []
        },
        {
          label: "App configuration",
          href: "/platform/app-config",
          icon: IconAdjustments,
          permissions: []
        }
      ]
    },
    {
      label: "Settings",
      href: "/settings",
      icon: IconSettings,
      permissions: [
        {
          permission: "settings",
          actions: ["view"]
        }
      ],
      links: [
        {
          label: "Profile",
          href: "/profile/view",
          permissions: []
        },
        {
          label: "User Roles",
          href: "/user-roles/list",
          permissions: [
            {
              permission: "settings-user-roles",
              actions: ["view"]
            }
          ]
        },

        {
          label: "General Settings",
          href: "/general-settings/list",
          permissions: []
        }
      ]
    }
  ]
} as const

export const betaNav = siteConfig.betaNav?.map((link) => ({
  ...link,
  href: `/beta_${link.href}`,
  links: link.links?.map((subLink) => ({
    ...subLink,
    href: `/beta_${subLink.href}`
  }))
}))
