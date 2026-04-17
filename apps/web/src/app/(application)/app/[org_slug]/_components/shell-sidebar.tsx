"use client"

import {
  ActionIcon,
  Avatar,
  Divider,
  Group,
  Indicator,
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  MenuTarget,
  NavLink,
  randomId,
  Stack,
  UnstyledButton
} from "@repo/mantine-ui"
import { IconCircleDot, IconPoint } from "@repo/mantine-ui/icons/index"
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

export const ShellSidebar = () => {
  const { isBetaUser } = useApp()
  return (
    <div className="fixed inset-y-0 left-0 w-60 max-md:hidden md:w-[72px] lg:w-60">
      <nav className="flex h-full min-h-0 flex-col">
        <div className="mb-4 flex h-16 items-center justify-start">
          <div className="px-4 pt-6">
            {/* Logo */}
            <WorkspaceLink
              href="/dashboard"
              className="flex items-center gap-2"
            >
              <LogoIcon height={40} />
            </WorkspaceLink>
          </div>
        </div>
        <Divider />
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
          {/* Links */}
          <Stack gap={8}>
            {siteConfig.mainNav.map((link) => (
              <SidebarLink key={link.href} {...link} />
            ))}
            {/* Beta Links */}
            {isBetaUser && betaNav && (
              <Stack gap={8} mt={"sm"}>
                <Divider label="Beta" />
                {betaNav.map((link) => (
                  <SidebarLink key={link.href} {...link} />
                ))}
              </Stack>
            )}
          </Stack>
        </div>
        {/* Sidebar Footer */}
        <Divider />
        <div className="p-4">
          <FooterUserButton />
        </div>
      </nav>
    </div>
  )
}

const FooterUserButton = () => {
  const { organizationId } = useApp()
  const sidebarState = useThemeStore((store) => store.sidebarState)
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
      position={"top-start"}
      withArrow
      arrowSize={12}
      arrowPosition="center"
      shadow="md"
      offset={sidebarState === "full" ? 18 : 8}
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
            >
              {profile?.firstName[0]}
              {profile?.lastName[0]}
            </Avatar>
          </Indicator>
          <div className="hidden flex-1 flex-col gap-0 overflow-hidden lg:flex">
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

const SidebarLink = ({
  label,
  icon,
  href,
  links,
  permissions,
  isBeta,
  notifications,
  platformStaffOnly
}: NavItems) => {
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

  // Check if any sublink is active
  const isAnySubLinkActive =
    links?.some((link) => isPathActive(link.href, cleanPath)) ?? false

  // Check if any sub-sublink is active
  const isAnySubSubLinkActive =
    links?.some((link) =>
      link.links?.some((subLink) => isPathActive(subLink.href, cleanPath))
    ) ?? false

  // Main active state
  const active =
    isPathActive(href, cleanPath) || isAnySubLinkActive || isAnySubSubLinkActive

  const can = permissions.every((permission) => {
    const canAccess = permission.actions.some((action) =>
      ability.can(action, permission.permission)
    )
    return canAccess
  })

  const handleOnClick = (opened: boolean) => {
    if (sidebarState !== "full") return
    setOpened(opened)
  }

  useEffect(() => {
    if (sidebarState !== "full" && opened) {
      setOpened(false)
    }
  }, [sidebarState, opened])

  useEffect(() => {
    if (sidebarState === "full" && !opened && defaultOpened) {
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
    if (sidebarState === "full")
      return (
        <NavLink
          component={WorkspaceLink}
          withLoading={true}
          href={href}
          label={
            <Group wrap="nowrap">
              {label}
              {typeof notifications === "function"
                ? React.createElement(notifications)
                : notifications}
            </Group>
          }
          leftSection={<Icon size={20} stroke={1.5} />}
          active={active}
          classNames={{
            label: "text-sm",
            root: "rounded-md"
          }}
        />
      )

    return (
      // labels without multiple links
      <Menu
        width={180}
        withArrow
        arrowSize={12}
        arrowPosition="center"
        shadow="lg"
        offset={4}
        position="right"
        trigger="click-hover"
        classNames={{
          label: "text-sm"
        }}
      >
        <MenuTarget>
          <ActionIcon
            variant={active ? "light" : "subtle"}
            color={active ? "wine" : "dark"}
            h={36}
            w={36}
            component={WorkspaceLink}
            href={href}
            className="self-center transition-all duration-200 ease-in-out"
          >
            <Icon size={20} stroke={1.5} />
          </ActionIcon>
        </MenuTarget>
        <MenuDropdown>
          <MenuLabel fz={"sm"}>{label}</MenuLabel>
        </MenuDropdown>
      </Menu>
    )
  }

  if (sidebarState === "full") {
    return (
      <NavLink
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
        prefetch={false}
        href={href}
        opened={opened}
        onChange={handleOnClick}
        classNames={{
          label: "text-sm",
          root: active ? "rounded-md bg-wine-500" : "rounded-md"
        }}
      >
        <Stack gap={4}>
          {links.map((link) => {
            const { notifications, platformStaffOnly: _, ...rest } = link
            const linkActive = isPathActive(link.href, cleanPath)

            const canAccess = link.permissions.every((permission) => {
              const canAccess = permission.actions.some((action) =>
                ability.can(action, permission.permission)
              )
              return canAccess
            })

            if (!canAccess) return null
            if (link.platformStaffOnly && !isPlatformStaff) return null

            const Icon = link.icon ?? IconPoint
            const Notifications = notifications ?? IconCircleDot

            if (link.links) {
              return (
                <NavLink
                  p={"6px"}
                  key={link.href}
                  component={WorkspaceLink}
                  href={link.href}
                  onMouseEnter={() => setHovered(link.href)}
                  onMouseLeave={() => setHovered(null)}
                  prefetch={hovered === link.href}
                  // label={link.label}
                  label={
                    <Group wrap="nowrap">
                      {link.label}
                      {typeof link.notifications === "function"
                        ? React.createElement(link.notifications)
                        : link.notifications}
                    </Group>
                  }
                  active={link.links.some((subLink) =>
                    isPathActive(subLink.href, cleanPath)
                  )}
                  leftSection={<Icon size={18} stroke={1.5} />}
                  classNames={{
                    label: "text-sm",
                    root: linkActive ? "rounded-md bg-wine-500" : "rounded-md"
                  }}
                  childrenOffset={16}
                >
                  {link.links.map((subLink) => {
                    if (subLink.platformStaffOnly && !isPlatformStaff)
                      return null
                    const subLinkActive = isPathActive(subLink.href, cleanPath)
                    return (
                      <NavLink
                        p={"6px"}
                        key={subLink.href}
                        component={WorkspaceLink}
                        href={subLink.href}
                        onMouseEnter={() => setHovered(subLink.href)}
                        onMouseLeave={() => setHovered(null)}
                        prefetch={hovered === subLink.href}
                        withLoading={true}
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
                  link.notifications ? (
                    <Group wrap="nowrap">
                      {link.label}
                      <Notifications />
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
                classNames={{
                  label: "text-sm",
                  root: linkActive ? "rounded-md bg-wine-500" : "rounded-md"
                }}
                leftSection={<Icon size={18} stroke={1.5} />}
              />
            )
          })}
        </Stack>
      </NavLink>
    )
  }

  return (
    <Menu
      classNames={{ dropdown: "w-auto min-w-[180px]" }}
      withArrow
      arrowSize={12}
      arrowPosition="center"
      shadow="lg"
      offset={4}
      position="right"
      trigger="click-hover"
    >
      <MenuTarget>
        {/* {FIX} */}
        {React.isValidElement(notifications?.()) ? (
          <Indicator size={10} color="red" className="self-center">
            <ActionIcon
              variant={active ? "light" : "subtle"}
              color={!active ? "dark" : "wine"}
              h={36}
              w={36}
              className="transition-all duration-200 ease-in-out"
            >
              <Icon size={20} stroke={1.5} />
            </ActionIcon>
          </Indicator>
        ) : (
          <ActionIcon
            className="self-center"
            variant={active ? "light" : "subtle"}
            color={!active ? "dark" : "wine"}
            h={36}
            w={36}
          >
            <Icon size={20} stroke={1.5} />
          </ActionIcon>
        )}
      </MenuTarget>
      <MenuDropdown>
        <MenuLabel fz={"sm"}>{label}</MenuLabel>
        <MenuDivider />
        {links.map((link) => {
          const canAccess = link.permissions.every((permission) => {
            const canAccess = permission.actions.some((action) =>
              ability.can(action, permission.permission)
            )
            return canAccess
          })

          if (!canAccess) return null
          if (link.platformStaffOnly && !isPlatformStaff) return null

          const linkActive = isPathActive(link.href, cleanPath)
          const Icon = link.icon ?? IconPoint
          const _Notifications = link.notifications ?? IconCircleDot

          if (link.links) {
            return (
              <Menu key={link.href}>
                <Menu.Label>{link.label}</Menu.Label>
                {link.links.map((subLink) => {
                  if (subLink.platformStaffOnly && !isPlatformStaff) return null
                  return (
                    <MenuItem
                      component={WorkspaceLink}
                      withLoading={true}
                      key={subLink.href}
                      href={subLink.href}
                      onMouseEnter={() => setHovered(subLink.href)}
                      onMouseLeave={() => setHovered(null)}
                      prefetch={hovered === subLink.href}
                      bg={
                        pathsMatching(router.pathname, subLink.href)
                          ? "wine.1"
                          : undefined
                      }
                      leftSection={<IconPoint size={18} stroke={1.5} />}
                    >
                      <Group wrap="nowrap">
                        {subLink.label}
                        {typeof subLink.notifications === "function"
                          ? React.createElement(subLink.notifications)
                          : subLink.notifications}
                      </Group>
                    </MenuItem>
                  )
                })}
              </Menu>
            )
          }
          return (
            <MenuItem
              component={WorkspaceLink}
              withLoading={true}
              href={link.href}
              bg={linkActive ? "wine.1" : undefined}
              key={randomId()}
              leftSection={<Icon size={18} stroke={1.5} />}
              fz={"sm"}
              onMouseEnter={() => setHovered(link.href)}
              onMouseLeave={() => setHovered(null)}
              prefetch={hovered === link.href}
            >
              <Group wrap="nowrap">
                {link.label}
                {typeof link.notifications === "function"
                  ? React.createElement(link.notifications)
                  : link.notifications}
              </Group>
            </MenuItem>
          )
        })}
      </MenuDropdown>
    </Menu>
  )
}

function getBasePath(path: string) {
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

  if (segments[0] === "jobs") {
    const subpages = ["list", "create", "view", "edit"]
    if (segments.length >= 2 && subpages.includes(segments[1] ?? "")) {
      return `/${segments.slice(0, 2).join("/")}`
    }
    return "/jobs/list"
  }

  if (segments[0] === "shipments") {
    const subpages = ["list"]
    if (segments.length >= 2 && subpages.includes(segments[1] ?? "")) {
      return `/${segments.slice(0, 2).join("/")}`
    }
    return "/shipments/list"
  }

  // Purchase orders: treat /purchase-orders/list and /purchase-orders/create as separate paths
  if (segments[0] === "purchase-orders") {
    const subpages = ["list", "create", "view", "edit"]
    if (segments.length >= 2 && subpages.includes(segments[1] ?? "")) {
      return `/${segments.slice(0, 2).join("/")}`
    }
    return "/purchase-orders/list"
  }

  // Items: treat /items/list and /items/create as separate paths
  if (segments[0] === "items") {
    const subpages = ["list", "create", "view", "edit"]
    if (segments.length >= 2 && subpages.includes(segments[1] ?? "")) {
      return `/${segments.slice(0, 2).join("/")}`
    }
    return "/items/list"
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

  if (segments[0] === "hr") {
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

function isPathActive(pathToCheck: string, cleanPath: string) {
  const basePathToCheck = getBasePath(pathToCheck)
  const currentBasePath = getBasePath(cleanPath)

  return currentBasePath === basePathToCheck
}
