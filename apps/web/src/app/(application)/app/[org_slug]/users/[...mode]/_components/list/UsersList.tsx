"use client"

import type { RouterOutputs } from "@repo/api"
import { Badge, Button, Group, Select, Stack, Tabs } from "@repo/mantine-ui"
import type { MRT_ColumnDef } from "@repo/mantine-ui/data-table"
import {
  MantineReactTable,
  useMantineReactTable
} from "@repo/mantine-ui/data-table"
import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"

import { getDefaultMRTOptions } from "#/core/components/custom-table/custom-table"
import { TopPageWrapper } from "#/core/components/top-page-wrapper/TopPageWrapper"
import { useRBAC } from "#/core/context/rbac/useRBAC"
import { useIsMobile } from "#/hooks/useIsMobile"
import { useWorkspaceRouter } from "#/hooks/useWorkspaceRouter"
import { api } from "#/trpc/react"
import { formatPhoneNumber } from "#/utils/format_phone"
import { InvitedUsersPanel } from "./InvitedUsersPanel"
import MobileUsersList from "./MobileUserList"

type Profile = NonNullable<RouterOutputs["profiles"]["getAllProfiles"]>[number]

export default function UsersListPage({
  organizationId
}: {
  organizationId: string
}) {
  const router = useWorkspaceRouter()
  const pathname = usePathname()
  const ability = useRBAC()
  const isMobile = useIsMobile()

  const [selectedStatus, setSelectedStatus] = useState<string>("active")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const [users, usersQuery] = api.profiles.getAllProfiles.useSuspenseQuery({
    organizationId: organizationId
  })

  const [roles, _rolesQuery] = api.aclsRoles.getAllAclsRoles.useSuspenseQuery()

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Status filter
      if (selectedStatus === "active" && user.inactive) return false
      if (selectedStatus === "inactive" && !user.inactive) return false

      // Role filter
      if (selectedRole && user._aclRole.slug !== selectedRole) return false

      return true
    })
  }, [users, selectedStatus, selectedRole])

  const viewUserProfile = (id: string) => {
    router.router.push(
      pathname.replace("list", "view").concat(`/${id}?tab=information`)
    )
  }

  const defaultMRTOptions = getDefaultMRTOptions<Profile>()
  const columns = useMemo<MRT_ColumnDef<Profile>[]>(
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
        accessorFn: (row) => row.phone,
        header: "Phone",
        Cell: ({ row }) => formatPhoneNumber(row.original.phone ?? "")
      },
      {
        accessorFn: (row) => row._aclRole.name,
        header: "Role"
      },
      {
        accessorFn: (row) => (row.inactive ? "Inactive" : "Active"),
        header: "Status",
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ row }: { row: { original: Profile } }) => {
          return (
            <Badge
              variant="light"
              color={row.original.inactive ? "red" : "green"}
            >
              {row.original.inactive ? "Inactive" : "Active"}
            </Badge>
          )
        }
      }
    ],
    []
  )

  const table = useMantineReactTable({
    ...defaultMRTOptions,
    layoutMode: "semantic",
    columns,
    data: filteredUsers,
    state: { isLoading: usersQuery.isLoading },
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        viewUserProfile(row.original.id)
      },
      style: {
        cursor: "pointer"
      }
    })
  })

  return (
    <TopPageWrapper
      pageTitle="Users"
      primaryActions={[
        {
          label: "Invite User",
          href: router.createWorkspaceUrl("/users/invite"),
          visibility: ability.can("add", "users")
        }
      ]}
    >
      <Tabs defaultValue="users">
        <Tabs.List>
          <Tabs.Tab value="users">Users</Tabs.Tab>
          <Tabs.Tab value="invited">Invited</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="users" pt="md">
          {isMobile ? (
            <MobileUsersList isMobile={isMobile} />
          ) : (
            <Stack>
              <Group align="end">
                <Select
                  searchable
                  onClear={() => setSelectedRole(null)}
                  clearable
                  size="xs"
                  label="Role"
                  placeholder="Select role"
                  value={selectedRole}
                  onChange={(value) => setSelectedRole(value ?? "")}
                  data={roles?.map((role) => ({
                    value: role.slug,
                    label: role.name
                  }))}
                />
                <Select
                  size="xs"
                  label="Worker Status"
                  data={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" }
                  ]}
                  value={selectedStatus}
                  onChange={(value) => setSelectedStatus(value ?? "active")}
                />
                <Button
                  size="compact-sm"
                  disabled={
                    selectedStatus === "active" &&
                    selectedRole === null &&
                    selectedStatus === "active"
                  }
                  onClick={() => {
                    setSelectedStatus("active")
                    setSelectedRole(null)
                  }}
                >
                  Clear
                </Button>
              </Group>
              <MantineReactTable table={table} />
            </Stack>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="invited" pt="md">
          <InvitedUsersPanel
            organizationId={organizationId}
            isMobile={isMobile}
          />
        </Tabs.Panel>
      </Tabs>
    </TopPageWrapper>
  )
}
