"use client"

import type { RouterOutputs } from "@repo/api"
import { Badge, Loader, Paper, Stack, Table, Text } from "@repo/mantine-ui"
import { api } from "#/trpc/react"
import { formatDate } from "#/utils/format"
import { formatPhoneNumber } from "#/utils/format_phone"

type InvitedRow = NonNullable<
  RouterOutputs["profiles"]["getPendingInviteProfiles"]
>[number]

export function InvitedUsersPanel({
  organizationId,
  isMobile
}: {
  organizationId: string
  isMobile: boolean
}) {
  const { data: invited = [], isLoading } =
    api.profiles.getPendingInviteProfiles.useQuery({ organizationId })

  if (isLoading) {
    return (
      <Stack align="center" py="xl">
        <Loader size="sm" />
      </Stack>
    )
  }

  if (invited.length === 0) {
    return (
      <Paper p="lg" withBorder>
        <Text c="dimmed" ta="center">
          No pending invitations. Invited people appear here until they confirm
          their email.
        </Text>
      </Paper>
    )
  }

  if (isMobile) {
    return (
      <Stack gap="sm">
        {invited.map((row) => (
          <InvitedMobileCard key={row.id} row={row} />
        ))}
      </Stack>
    )
  }

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Phone</Table.Th>
          <Table.Th>Role</Table.Th>
          <Table.Th>Invited</Table.Th>
          <Table.Th>Status</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {invited.map((row) => (
          <Table.Tr key={row.id}>
            <Table.Td>{row.fullName}</Table.Td>
            <Table.Td>{row.email ?? "—"}</Table.Td>
            <Table.Td>{formatPhoneNumber(row.phone ?? "")}</Table.Td>
            <Table.Td>{row.roleName ?? row.aclRole}</Table.Td>
            <Table.Td>
              {row.invitedAt ? formatDate(row.invitedAt) : "—"}
            </Table.Td>
            <Table.Td>
              <Badge color="orange" variant="light">
                Pending
              </Badge>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

function InvitedMobileCard({ row }: { row: InvitedRow }) {
  return (
    <Paper p="md" withBorder radius="md" shadow="xs">
      <Stack gap={4}>
        <Text fw={600}>{row.fullName}</Text>
        <Text size="sm" c="dimmed">
          {row.email ?? "—"}
        </Text>
        <Text size="sm">{formatPhoneNumber(row.phone ?? "")}</Text>
        <Text size="sm">Role: {row.roleName ?? row.aclRole}</Text>
        {row.invitedAt ? (
          <Text size="xs" c="dimmed">
            Invited {formatDate(row.invitedAt)}
          </Text>
        ) : null}
        <Badge color="orange" variant="light" w="fit-content">
          Pending
        </Badge>
      </Stack>
    </Paper>
  )
}
