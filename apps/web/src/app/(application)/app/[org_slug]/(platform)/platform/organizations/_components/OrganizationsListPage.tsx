"use client"

import { Badge, Stack, Table, Text } from "@repo/mantine-ui"

import { TopPageWrapper } from "#/core/components/top-page-wrapper/TopPageWrapper"
import { api } from "#/trpc/react"

export function OrganizationsListPage() {
  const [organizations] = api.platform.listOrganizations.useSuspenseQuery()

  return (
    <TopPageWrapper pageTitle="Organizations">
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          All workspaces. Platform module — not scoped to the workspace in the
          URL.
        </Text>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Slug</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Created</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {organizations.map((org) => (
              <Table.Tr key={org.id}>
                <Table.Td>{org.name}</Table.Td>
                <Table.Td>
                  <Text size="sm" ff="monospace">
                    {org.slug}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge
                    size="sm"
                    color={org.inactive ? "red" : "green"}
                    variant="light"
                  >
                    {org.inactive ? "Inactive" : "Active"}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {org.createdAt
                      ? new Date(org.createdAt).toLocaleDateString()
                      : "—"}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </TopPageWrapper>
  )
}
