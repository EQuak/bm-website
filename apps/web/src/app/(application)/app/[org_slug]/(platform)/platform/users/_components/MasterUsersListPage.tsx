"use client"

import type { RouterOutputs } from "@repo/api"
import { Badge, Stack, Text } from "@repo/mantine-ui"
import type { MRT_ColumnDef } from "@repo/mantine-ui/data-table"
import {
  MantineReactTable,
  useMantineReactTable
} from "@repo/mantine-ui/data-table"
import { useMemo } from "react"

import { getDefaultMRTOptions } from "#/core/components/custom-table/custom-table"
import { TopPageWrapper } from "#/core/components/top-page-wrapper/TopPageWrapper"
import { api } from "#/trpc/react"

type MasterUser = NonNullable<
  RouterOutputs["platform"]["listMasterUsers"]
>[number]

export function MasterUsersListPage() {
  const [profiles, profilesQuery] =
    api.platform.listMasterUsers.useSuspenseQuery()

  const defaultMRTOptions = getDefaultMRTOptions<MasterUser>()
  const columns = useMemo<MRT_ColumnDef<MasterUser>[]>(
    () => [
      {
        accessorFn: (row) => row.fullName,
        header: "Name"
      },
      {
        accessorFn: (row) => row.user?.email,
        header: "Email"
      },
      {
        id: "organization",
        accessorFn: (row) => row._organization?.name ?? "",
        header: "Organization",
        Cell: ({ row }) => (
          <Stack gap={0}>
            <Text size="sm">{row.original._organization?.name ?? "—"}</Text>
            {row.original._organization?.slug ? (
              <Text size="xs" c="dimmed" ff="monospace">
                {row.original._organization.slug}
              </Text>
            ) : null}
          </Stack>
        )
      },
      {
        accessorFn: (row) => row._aclRole?.name ?? row.aclRole,
        header: "Role"
      },
      {
        accessorFn: (row) => (row.inactive ? "Inactive" : "Active"),
        header: "Status",
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ row }: { row: { original: MasterUser } }) => (
          <Badge
            size="sm"
            variant="light"
            color={row.original.inactive ? "red" : "green"}
          >
            {row.original.inactive ? "Inactive" : "Active"}
          </Badge>
        )
      }
    ],
    []
  )

  const table = useMantineReactTable({
    ...defaultMRTOptions,
    layoutMode: "semantic",
    columns,
    data: profiles,
    state: { isLoading: profilesQuery.isLoading }
  })

  return (
    <TopPageWrapper pageTitle="All users">
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Every profile in the database (all organizations). Includes inactive
          users.
        </Text>
        <MantineReactTable table={table} />
      </Stack>
    </TopPageWrapper>
  )
}
