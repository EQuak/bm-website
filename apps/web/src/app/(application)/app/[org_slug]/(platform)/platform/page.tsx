"use client"

import { Card, SimpleGrid, Stack, Text, Title } from "@repo/mantine-ui"
import {
  IconAdjustments,
  IconBuilding,
  IconCode,
  IconUsers
} from "@repo/mantine-ui/icons/index"
import { TopPageWrapper } from "#/core/components/top-page-wrapper/TopPageWrapper"
import WorkspaceLink from "#/core/components/WorkspaceLink"

const MODULE_LINKS = [
  {
    title: "Organizations",
    description: "Every workspace in the system.",
    href: "/platform/organizations",
    Icon: IconBuilding
  },
  {
    title: "All users",
    description: "Profiles across all organizations.",
    href: "/platform/users",
    Icon: IconUsers
  },
  {
    title: "Developer tools",
    description: "Impersonation and other internal utilities.",
    href: "/platform/developer-tools",
    Icon: IconCode
  },
  {
    title: "App configuration",
    description: "Maintenance, security, and email provider for the instance.",
    href: "/platform/app-config",
    Icon: IconAdjustments
  }
] as const

export default function PlatformOverviewPage() {
  return (
    <TopPageWrapper pageTitle="Platform">
      <Stack gap="lg">
        <Text c="dimmed" size="sm">
          Internal directory and tools. Lists and actions here are not limited
          to the current workspace slug in the URL.
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {MODULE_LINKS.map(({ title, description, href, Icon }) => (
            <WorkspaceLink
              key={href}
              href={href}
              className="block text-inherit no-underline"
            >
              <Card
                withBorder
                padding="lg"
                radius="md"
                className="h-full transition-colors hover:bg-mtn-gray-0 dark:hover:bg-zinc-800/50"
              >
                <Stack gap="xs">
                  <Icon size={28} stroke={1.5} />
                  <Title order={4}>{title}</Title>
                  <Text size="sm" c="dimmed">
                    {description}
                  </Text>
                </Stack>
              </Card>
            </WorkspaceLink>
          ))}
        </SimpleGrid>
      </Stack>
    </TopPageWrapper>
  )
}
