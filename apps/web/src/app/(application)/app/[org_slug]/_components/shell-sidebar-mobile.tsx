"use client"

import {
  ActionIcon,
  Avatar,
  Divider,
  Drawer,
  Group,
  Indicator,
  Menu,
  MenuTarget,
  NavLink,
  Stack,
  UnstyledButton,
  useMediaQuery
} from "@repo/mantine-ui"
import { IconCircleDot, IconPoint, IconX } from "@repo/mantine-ui/icons/index"
import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"
import { LogoIcon } from "#/assets/icons/logo"
import WorkspaceLink from "#/core/components/WorkspaceLink"
import { pathsMatching } from "#/core/config/routes"
import { betaNav, siteConfig } from "#/core/config/site"
import { useApp } from "#/core/context/AppContext"
import { useRBAC } from "#/core/context/rbac/useRBAC"
import { useWorkspaceRouter } from "#/hooks/useWorkspaceRouter"
import { useThemeStore } from "#/providers/theme-store-provider"
import { api } from "#/trpc/react"
import type { NavItems } from "#/types"
import UserMenuDropdown from "./user-menu-dropdown"

export const ShellSidebarMobile = ({
  sidebarIsOpen,
  sidebarHandlers
}: {
  sidebarIsOpen: boolean
  sidebarHandlers: {
    toggle: () => void
    close: () => void
  }
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { isBetaUser } = useApp()
  return (
    <Drawer.Root
      size={246}
      offset={isMobile ? 0 : 8}
      radius={isMobile ? "none" : "md"}
      opened={sidebarIsOpen}
      onClose={sidebarHandlers.close}
      position="left"
    >
      <Drawer.Overlay color="#000" opacity={0.4} />
      <Drawer.Content className="flex">
        <Drawer.Body className="flex-1 bg-white p-0">
          <nav className="flex h-full min-h-0 flex-col">
            <div className="relative mb-4 flex h-16 items-center justify-start">
              <div className="px-4 pt-6">
                {/* Logo */}
                <WorkspaceLink
                  href="/dashboard"
                  className="flex items-center gap-2"
                >
                  <LogoIcon height={40} />
                </WorkspaceLink>
              </div>
              <div className="-translate-y-1/2 absolute top-[50%] right-2">
                <ActionIcon
                  variant="subtle"
                  radius={"xl"}
                  size={32}
                  onClick={sidebarHandlers.close}
                >
                  <IconX size={24} onClick={sidebarHandlers.close} />
                </ActionIcon>
              </div>
            </div>
            <Divider />
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
              {/* Links */}
              <Stack gap={8}>
                {siteConfig.mainNav.map((link) => (
                  <SidebarLinkMobile
                    key={link.href}
                    {...link}
                    toggleSidebar={sidebarHandlers.toggle}
                  />
                ))}
                {isBetaUser && betaNav && (
                  <Stack gap={8} mt={"xl"}>
                    <Divider label="Beta" />
                    {betaNav.map((link) => (
                      <SidebarLinkMobile
                        key={link.href}
                        {...link}
                        toggleSidebar={sidebarHandlers.toggle}
                      />
                    ))}
                  </Stack>
                )}
              </Stack>
            </div>
            {/* Sidebar Footer */}
            <Divider />
            <div className="p-4">
              <FooterUserButtonMobile />
            </div>
          </nav>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  )
}

const FooterUserButtonMobile = () => {
  const { organizationId } = useApp()
  const [profile] = api.profiles.getProfileByUserLogged.useSuspenseQuery({
    organizationId
  })
  const [isImpersonating, setIsImpersonating] = useState(false)

  // Read impersonation state from cookie on the client
  useEffect(() => {
    setIsImpersonating(!!Cookies.get("dev_impersonation"))
  }, [])

  return (
    <Menu
      width={224}
      position="top-start"
      withArrow
      arrowSize={12}
      arrowPosition="center"
      shadow="md"
      offset={8}
    >
      <MenuTarget>
        <UnstyledButton className="flex items-center justify-between gap-2 overflow-hidden px-0 py-2">
          <Indicator
            disabled={!isImpersonating}
            color="red"
            size={12}
            position="bottom-end"
            withBorder
            processing
          >
            <Avatar
              src={profile?.avatar}
              w={40}
              h={40}
              radius={"md"}
              alt={`${profile?.firstName} ${profile?.lastName} avatar`}
            />
          </Indicator>
          <div className="flex flex-1 flex-col gap-0 overflow-hidden">
            <span className="truncate font-semibold text-sm">
              {profile?.firstName} {profile?.lastName}
            </span>
            <span className="truncate text-xs">
              {profile?.user?.email ?? "No email"}
            </span>
          </div>
        </UnstyledButton>
      </MenuTarget>
      <UserMenuDropdown
        isImpersonating={isImpersonating}
        profile={{
          firstName: profile?.firstName ?? "",
          lastName: profile?.lastName ?? "",
          avatar: profile?.avatar ?? "",
          email: profile?.user?.email ?? ""
        }}
      />
    </Menu>
  )
}

const SidebarLinkMobile = ({
  label,
  icon,
  href,
  links,
  permissions,
  isBeta,
  toggleSidebar,
  notifications,
  platformStaffOnly
}: NavItems & { toggleSidebar: () => void }) => {
  const { isPlatformStaff } = useApp()
  const router = useWorkspaceRouter()
  const ability = useRBAC()
  const sidebarState = useThemeStore((store) => store.sidebarState)
  const defaultOpened = links?.some((link) =>
    pathsMatching(router.pathname, link.href)
  )
  const [opened, setOpened] = useState(!!defaultOpened)
  const [hovered, setHovered] = useState<string | null>(null)

  const Icon = icon ?? IconCircleDot
  const cleanPath = router.pathname.replace(/^\/app\/[^/]+/, "") || "/"

  // Get the base path up to the category for reference material
  const getBasePath = (path: string) => {
    const segments = path.split("/").filter(Boolean)

    // Users: treat /users/my-profile and /users/list as separate paths
    if (segments[0] === "users") {
      const subpages = ["my-profile", "list", "create", "invite"]
      if (segments.length >= 2 && subpages.includes(segments[1] ?? "")) {
        return `/${segments.slice(0, 2).join("/")}`
      }
      // For /users/view/[id] or /users/edit/[id], keep "All Users" active
      if (segments[1] === "view" || segments[1] === "edit") {
        return "/users/list"
      }
      // For other user paths, return base path
      return "/users"
    }

    // Suggestions: treat /suggestions/list and /suggestions/create as separate paths
    if (segments[0] === "suggestions") {
      const subpages = ["list", "create"]
      if (segments.length >= 2 && subpages.includes(segments[1] ?? "")) {
        return `/${segments.slice(0, 2).join("/")}`
      }
      // For /suggestions/view/[id] or /suggestions/edit/[id], keep "List" active
      if (segments[1] === "view" || segments[1] === "edit") {
        return "/suggestions/list"
      }
      return "/suggestions"
    }

    // Tickets: treat /tickets and /tickets/[id] as parent, others as their own
    if (segments[0] === "tickets") {
      // If only /tickets or /tickets/some-id (where some-id is not a known subpage)
      const subpages = ["create", "management-list", "list", "departments"]
      if (
        segments.length === 1 ||
        (segments.length === 2 && !subpages.includes(segments[1] ?? ""))
      ) {
        return "/tickets"
      }
      // For subpages, return the full path
      return `/${segments.slice(0, 2).join("/")}`
    }

    // Work-orders requester: treat /requester and /requester/[id] as different paths
    if (
      segments[0] === "inventory" &&
      segments[1] === "work-orders" &&
      segments[2] === "requester"
    ) {
      // If it's /requester/create, return the full path for "Create Request"
      if (segments.length === 4 && segments[3] === "create") {
        return "/inventory/work-orders/requester/create"
      }
      // For /requester and /requester/[id], return base path for "My Requests"
      return "/inventory/work-orders/requester"
    }

    // ... (rest of your logic unchanged)
    if (segments[0] === "reference-material" || segments[0] === "reports") {
      return `/${segments.slice(0, 2).join("/")}`
    }
    if (segments[0] === "inventory" && segments[1] === "transactions") {
      return `/${segments.slice(0, 3).join("/")}`
    }
    if (segments[0] === "inventory" && segments[1] === "work-orders") {
      return `/${segments.slice(0, 3).join("/")}`
    }
    if (segments[0] === "inventory") {
      return `/${segments.slice(0, 2).join("/")}`
    }
    if (segments[0] === "platform") {
      if (segments.length >= 2) {
        return `/${segments.slice(0, 2).join("/")}`
      }
      return "/platform"
    }
    return `/${segments[0] ?? ""}`
  }

  // Check if a path is active based on its base path
  const isPathActive = (pathToCheck: string) => {
    const basePathToCheck = getBasePath(pathToCheck)
    const currentBasePath = getBasePath(cleanPath)
    return currentBasePath === basePathToCheck
  }

  // Check if any sublink is active
  const isAnySubLinkActive =
    links?.some((link) => isPathActive(link.href)) ?? false

  // Check if any sub-sublink is active
  const isAnySubSubLinkActive =
    links?.some((link) =>
      link.links?.some((subLink) => isPathActive(subLink.href))
    ) ?? false

  // Main active state
  const active =
    isPathActive(href) || isAnySubLinkActive || isAnySubSubLinkActive

  const can = permissions.every((permission) => {
    const canAccess = permission.actions.some((action) =>
      ability.can(action, permission.permission)
    )
    return canAccess
  })

  const handleOnClick = (opened: boolean) => {
    setOpened(opened)
  }

  useEffect(() => {
    if (!opened && defaultOpened) {
      setOpened(true)
    }
  }, [sidebarState])

  if (platformStaffOnly && !isPlatformStaff) {
    return null
  }

  if (!can && !isBeta) {
    return null
  }

  if (!links?.length) {
    return (
      <NavLink
        p={"6px"}
        component={WorkspaceLink}
        href={href}
        label={label}
        onMouseEnter={() => setHovered(href)}
        onMouseLeave={() => setHovered(null)}
        prefetch={hovered === href}
        leftSection={<Icon size={20} stroke={1.5} />}
        active={active}
        onClick={toggleSidebar}
        classNames={{
          label: "text-sm",
          root: "rounded-md"
        }}
      />
    )
  }

  return (
    <NavLink
      p={"6px"}
      label={
        React.isValidElement(notifications?.()) ? (
          <Group wrap="nowrap">
            {label}
            <Indicator position="middle-center" size={12} color="red" />
          </Group>
        ) : (
          label
        )
      }
      leftSection={<Icon size={20} stroke={1.5} />}
      active={active}
      component={WorkspaceLink}
      withLoading={true}
      prefetch={false}
      href={href}
      opened={opened}
      onChange={handleOnClick}
      classNames={{
        label: "text-sm",
        root: "rounded-md"
      }}
      childrenOffset={8}
    >
      <Stack gap={4}>
        {links.map((link) => {
          const { notifications, platformStaffOnly: _, ...rest } = link

          const linkActive = isPathActive(link.href)

          const canAccess = link.permissions.every((permission) => {
            const canAccess = permission.actions.some((action) =>
              ability.can(action, permission.permission)
            )
            return canAccess
          })

          if (!canAccess) return null
          if (link.platformStaffOnly && !isPlatformStaff) return null
          const Notifications = link.notifications ?? IconCircleDot
          if (link.links) {
            return (
              <NavLink
                p={"6px"}
                key={link.href}
                component={WorkspaceLink}
                href={link.href}
                prefetch={hovered === link.href}
                onMouseEnter={() => setHovered(link.href)}
                onMouseLeave={() => setHovered(null)}
                label={
                  <Group wrap="nowrap">
                    {link.label}
                    {typeof link.notifications === "function"
                      ? React.createElement(link.notifications)
                      : link.notifications}
                  </Group>
                }
                withLoading={true}
                active={link.links.some((subLink) =>
                  isPathActive(subLink.href)
                )}
                leftSection={<Icon size={18} stroke={1.5} />}
                classNames={{
                  label: "text-sm",
                  root: active ? "rounded-md bg-wine-500" : "rounded-md"
                }}
                childrenOffset={16}
              >
                {link.links.map((subLink) => {
                  if (subLink.platformStaffOnly && !isPlatformStaff) return null
                  const subLinkActive = isPathActive(subLink.href)
                  return (
                    <NavLink
                      p={"6px"}
                      key={subLink.href}
                      component={WorkspaceLink}
                      href={subLink.href}
                      // label={subLink.label}
                      label={
                        <Group wrap="nowrap">
                          {subLink.label}
                          {typeof subLink.notifications === "function"
                            ? React.createElement(subLink.notifications)
                            : subLink.notifications}
                        </Group>
                      }
                      leftSection={<IconPoint size={18} stroke={1.5} />}
                      active={subLinkActive}
                      classNames={{
                        label: "text-sm",
                        root: subLinkActive
                          ? "rounded-md bg-wine-500"
                          : "rounded-md"
                      }}
                    />
                  )
                })}
              </NavLink>
            )
          }
          return (
            <NavLink
              p={"6px"}
              key={link.href}
              {...rest}
              label={
                React.isValidElement(notifications?.()) ? (
                  <Group wrap="nowrap">
                    {link.label} <Notifications size={18} stroke={1.5} />
                  </Group>
                ) : (
                  link.label
                )
              }
              component={WorkspaceLink}
              withLoading={true}
              active={linkActive}
              href={link.href}
              onMouseEnter={() => setHovered(link.href)}
              onMouseLeave={() => setHovered(null)}
              prefetch={hovered === link.href}
              onClick={toggleSidebar}
              leftSection={<IconPoint size={18} stroke={1.5} />}
              classNames={{
                label: "text-sm",
                root: "rounded-md"
              }}
            />
          )
        })}
      </Stack>
    </NavLink>
  )
}
