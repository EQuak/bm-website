"use client"

import type { DefaultMantineColor } from "@repo/mantine-ui"
import {
  ActionIcon,
  Anchor,
  Breadcrumbs,
  Button,
  Group,
  Menu,
  Popover,
  randomId,
  Stack,
  Text,
  Title,
  Tooltip,
  UnstyledButton
} from "@repo/mantine-ui"
import {
  IconArrowBackUp,
  IconChevronRight,
  IconDots,
  IconDotsVertical
} from "@repo/mantine-ui/icons/index"
import { cn } from "@repo/mantine-ui/utils/cn"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useApp } from "#/core/context/AppContext"
import {
  type BreadcrumbSegment,
  buildBreadcrumbs,
  getCollapsedSegments
} from "#/utils/breadcrumb"
import WorkspaceLink from "../WorkspaceLink"

export type TopPageWrapperProps = {
  children: React.ReactNode
  pageTitle?: React.ReactNode
  primaryActions?: PrimaryActionsProps[]
  secondaryActions?: PrimaryActionsProps[]
  className?: string
}

export function TopPageWrapper({
  children,
  className,
  primaryActions,
  secondaryActions,
  pageTitle
}: TopPageWrapperProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { orgSlug } = useApp()

  // Check if current path contains beta_
  const isBetaPath = pathname.includes("/beta_/")

  const withBetaWorkspaceHref = (href: string, workspaceHref?: boolean) => {
    if (!isBetaPath || href.includes("/beta_/")) return href
    if (workspaceHref) {
      const rest = href.startsWith("/") ? href : `/${href}`
      return `/beta_${rest}`
    }
    return href.replace(
      new RegExp(`^/app/${orgSlug}/`),
      `/app/${orgSlug}/beta_/`
    )
  }

  // Modify actions to include beta_ path if needed
  const modifiedPrimaryActions = primaryActions?.map((action) => {
    if ("href" in action && !action.href.includes("/beta_/")) {
      return {
        ...action,
        href: withBetaWorkspaceHref(action.href, action.workspaceHref)
      }
    }
    return action
  })

  const modifiedSecondaryActions = secondaryActions?.map((action) => {
    if ("href" in action && !action.href.includes("/beta_/")) {
      return {
        ...action,
        href: withBetaWorkspaceHref(action.href, action.workspaceHref)
      }
    }
    return action
  })

  return (
    <Stack
      className={cn(
        "mx-auto w-full max-w-full lg:max-w-[calc(1920px-theme(spacing.60))]",
        className
      )}
    >
      <Group gap={4} align="center">
        <Tooltip
          label="Go Back once"
          openDelay={200}
          position="bottom-start"
          withArrow
          arrowSize={5}
          classNames={{
            tooltip:
              "border border-mtn-primary-filled border-solid bg-white p-1 text-mtn-primary-filled text-xs",
            arrow: "border border-mtn-primary-filled border-solid"
          }}
        >
          <ActionIcon variant="subtle" size="sm" onClick={() => router.back()}>
            <IconArrowBackUp stroke={1.5} size={18} />
          </ActionIcon>
        </Tooltip>

        <BreadcrumbComponent />
      </Group>
      {!!pageTitle && (
        <Group justify="space-between">
          <Title order={3}>{pageTitle}</Title>
          <Group gap={4}>
            <PrimaryActionsGroup actions={modifiedPrimaryActions} />
            <SecondaryActionsGroup actions={modifiedSecondaryActions} />
          </Group>
        </Group>
      )}

      <>{children}</>
    </Stack>
  )
}

type PrimaryActionsProps =
  | {
      href: string
      workspaceHref?: boolean
      label: string
      leftSection?: React.ReactNode
      rightSection?: React.ReactNode
      color?: DefaultMantineColor
      variant?: string
      visibility?: boolean
    }
  | {
      label: string
      leftSection?: React.ReactNode
      rightSection?: React.ReactNode
      color?: DefaultMantineColor
      action: () => void
      variant?: string
      visibility?: boolean
    }

function KeyAction(props: PrimaryActionsProps) {
  if ("href" in props) {
    if (props.workspaceHref) {
      return (
        <Button
          size="compact-sm"
          component={WorkspaceLink}
          href={props.href}
          color={props.color}
          rightSection={props.rightSection}
          leftSection={props.leftSection}
          variant={props.variant}
        >
          {props.label}
        </Button>
      )
    }
    return (
      <Button
        size="compact-sm"
        component={Link}
        href={props.href}
        color={props.color}
        rightSection={props.rightSection}
        leftSection={props.leftSection}
        variant={props.variant}
      >
        {props.label}
      </Button>
    )
  }
  return (
    <Button
      size="compact-sm"
      color={props.color}
      rightSection={props.rightSection}
      leftSection={props.leftSection}
      variant={props.variant}
      onClick={props.action}
    >
      {props.label}
    </Button>
  )
}

/**
 * Key actions are actions that are displayed in the top right corner of the page.
 * They are used to perform actions that are important for the page.
 * They are displayed in a group of max 2 actions.
 * If there are more than 2 actions, pass them as an array to the `secondaryActions` prop.
 */
function PrimaryActionsGroup(props: { actions?: PrimaryActionsProps[] }) {
  if (!props.actions) return null
  return (
    <Group align="center" wrap="nowrap" gap={8}>
      {props.actions
        .filter((action) => action.visibility !== false) // Filter out actions with visibility set to false
        .map((action) => (
          <KeyAction key={randomId()} {...action} />
        ))}
    </Group>
  )
}

function SecondaryActionsGroup(props: { actions?: PrimaryActionsProps[] }) {
  if (!props.actions) return null
  const visibleActions = props.actions.filter(
    (action) => action.visibility !== false
  )
  if (visibleActions.length === 0) return null
  return (
    <Menu
      shadow="sm"
      position="bottom-end"
      withArrow
      classNames={{
        dropdown: "border-mtn-primary-filled",
        arrow: "border-mtn-primary-filled"
      }}
    >
      <Menu.Target>
        <ActionIcon size={26}>
          <IconDotsVertical stroke={1.5} size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {visibleActions.map((action) => (
          <SecondaryAction key={action.label} {...action} />
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}

function SecondaryAction(props?: PrimaryActionsProps) {
  if (!props) return null
  if ("href" in props) {
    if (props.workspaceHref) {
      return (
        <Menu.Item
          fz="sm"
          component={WorkspaceLink}
          href={props.href}
          rightSection={props.rightSection}
          leftSection={props.leftSection}
          color={props.color}
        >
          {props.label}
        </Menu.Item>
      )
    }
    return (
      <Menu.Item
        component={Link}
        href={props.href}
        rightSection={props.rightSection}
        leftSection={props.leftSection}
        color={props.color}
      >
        {props.label}
      </Menu.Item>
    )
  }
  return (
    <Menu.Item onClick={props.action}>
      {props.label}
      {props.rightSection}
      {props.leftSection}
    </Menu.Item>
  )
}

/**
 * Breadcrumb component with site.ts integration
 * - Uses site.ts as source of truth for labels
 * - Only leaf items (no children) are clickable links
 * - Handles dynamic parameters (UUIDs, IDs)
 * - Supports truncation and collapse for long paths
 */
function BreadcrumbComponent() {
  const pathname = usePathname()

  const segments = useMemo(() => buildBreadcrumbs(pathname), [pathname])

  const { visibleSegments, collapsedSegments, shouldCollapse } = useMemo(() => {
    return getCollapsedSegments(segments, 4)
  }, [segments])

  const separator = (
    <IconChevronRight
      stroke={1.5}
      size={16}
      className="stroke-mtn-primary-filled"
    />
  )

  // Build the breadcrumb items array with collapse indicator in correct position
  const breadcrumbItems: React.ReactNode[] = []

  visibleSegments.forEach((segment, index) => {
    // After first segment, insert the collapse indicator
    if (shouldCollapse && index === 1) {
      breadcrumbItems.push(
        <CollapsedSegments
          key="collapsed"
          allSegments={segments}
          collapsedSegments={collapsedSegments}
        />
      )
    }
    breadcrumbItems.push(
      <BreadcrumbItem key={segment.href} segment={segment} />
    )
  })

  return (
    <Breadcrumbs separatorMargin={4} separator={separator}>
      {breadcrumbItems}
    </Breadcrumbs>
  )
}

/**
 * Single breadcrumb item - renders as link or text based on isLink
 */
function BreadcrumbItem({ segment }: { segment: BreadcrumbSegment }) {
  const content = segment.isLink ? (
    <Anchor fz="sm" component={Link} href={segment.href}>
      {segment.label}
    </Anchor>
  ) : (
    <Text fz="sm" c="dimmed" component="span">
      {segment.label}
    </Text>
  )

  // Wrap with tooltip if truncated
  if (segment.truncated && segment.fullLabel) {
    return (
      <Tooltip label={segment.fullLabel} openDelay={300}>
        {content}
      </Tooltip>
    )
  }

  return content
}

/**
 * Collapsed segments dropdown - shows full path with hierarchy
 */
function CollapsedSegments({
  allSegments,
  collapsedSegments
}: {
  allSegments: BreadcrumbSegment[]
  collapsedSegments: BreadcrumbSegment[]
}) {
  const [opened, setOpened] = useState(false)

  if (collapsedSegments.length === 0) return null

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      withArrow
      shadow="md"
    >
      <Popover.Target>
        <UnstyledButton
          onClick={() => setOpened((o) => !o)}
          className="flex items-center rounded px-1 hover:bg-gray-100"
        >
          <IconDots size={16} className="stroke-mtn-primary-filled" />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap={0}>
          {allSegments.map((segment, index) => (
            <Group
              key={segment.href}
              gap={4}
              wrap="nowrap"
              className="py-1"
              style={{ paddingLeft: index * 12 }}
            >
              {index > 0 && (
                <IconChevronRight
                  size={12}
                  stroke={1.5}
                  className="shrink-0 stroke-gray-400"
                />
              )}
              <BreadcrumbItem segment={segment} />
            </Group>
          ))}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
