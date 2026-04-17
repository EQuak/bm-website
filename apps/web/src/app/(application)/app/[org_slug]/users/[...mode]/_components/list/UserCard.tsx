"use client"

import type { RouterOutputs } from "@repo/api"
import { ActionIcon, Avatar, Card, Group, Stack, Text } from "@repo/mantine-ui"
import {
  IconAt,
  IconEdit,
  IconEye,
  IconPhoneCall
} from "@repo/mantine-ui/icons/index"

import { useRBAC } from "#/core/context/rbac/useRBAC"
import { useWorkspaceRouter } from "#/hooks/useWorkspaceRouter"
import { formatPhoneNumber } from "#/utils/format_phone"

export type User = NonNullable<
  RouterOutputs["profiles"]["getProfilesWithSearchAndFiltersInfinite"]
>["employees"][number]

export default function UserCard({ user }: { user: User }) {
  const router = useWorkspaceRouter()
  const ability = useRBAC()
  return (
    <Card key={user.id} withBorder padding="md" radius="md" pos="relative">
      <Group hiddenFrom="xs" gap="md" align="flex-start">
        <Avatar size={64} radius="md" src={user.avatar} />
        <Stack gap={"0px"} style={{ flex: 1 }}>
          <Text fz="lg" fw={700}>
            {user.fullName}
          </Text>
          <Group wrap="nowrap" gap={10} mt={3}>
            <IconAt
              stroke={1.5}
              size={16}
              color="light-dark(var(--mantine-color-gray-5), var(--mantine-color-dark-3))"
            />
            <Text fz="xs" c="dimmed">
              {user.email}
            </Text>
          </Group>
          <Group wrap="nowrap" gap={10} mt={3}>
            <IconPhoneCall
              stroke={1.5}
              size={16}
              color="light-dark(var(--mantine-color-gray-5), var(--mantine-color-dark-3))"
            />
            <Text fz="xs" c="dimmed">
              {formatPhoneNumber(user.phone ?? undefined)}
            </Text>
          </Group>
          <Group gap={2}>
            <Text fz="xs" fw={500} c="dimmed">
              Role:
            </Text>
            <Text
              fz="xs"
              tt="uppercase"
              fw={700}
              c="light-dark(var(--mantine-color-gray-5), var(--mantine-color-dark-3))"
            >
              {user.role}
            </Text>
          </Group>
        </Stack>
      </Group>

      <Group
        gap="xs"
        style={{
          position: "absolute",
          top: "12px",
          right: "12px"
        }}
      >
        <ActionIcon
          size="sm"
          variant="subtle"
          color="green"
          onClick={() => router.workspacePush(`/users/view/${user.id}`)}
        >
          <IconEye size={20} />
        </ActionIcon>
        {ability.can("edit", "users") && (
          <ActionIcon
            size="sm"
            variant="subtle"
            color="blue"
            onClick={() => router.workspacePush(`/users/edit/${user.id}`)}
          >
            <IconEdit size={20} />
          </ActionIcon>
        )}
      </Group>
    </Card>
  )
}
