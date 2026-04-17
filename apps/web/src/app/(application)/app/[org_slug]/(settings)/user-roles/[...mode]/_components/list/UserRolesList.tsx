"use client"

import type { RouterOutputs } from "@repo/api"
import { ActionIcon, Group, Tooltip } from "@repo/mantine-ui"
import {
  createMRTColumnHelper,
  MantineReactTable,
  useMantineReactTable
} from "@repo/mantine-ui/data-table"
import { IconEdit, IconEye } from "@repo/mantine-ui/icons/index"

import { getDefaultMRTOptions } from "#/core/components/custom-table/custom-table"
import { TopPageWrapper } from "#/core/components/top-page-wrapper/TopPageWrapper"
import { useRBAC } from "#/core/context/rbac/useRBAC"
import { useWorkspaceRouter } from "#/hooks/useWorkspaceRouter"
import { api } from "#/trpc/react"

export type UserRole = NonNullable<
  RouterOutputs["aclsRoles"]["getAllAclsRoles"]
>[number]

export default function UserRolesList() {
  const ability = useRBAC()
  const router = useWorkspaceRouter()
  const [userRoles, userRolesQuery] =
    api.aclsRoles.getAllAclsRoles.useSuspenseQuery()

  const defaultMRTOptions = getDefaultMRTOptions<UserRole>()
  const columnHelper = createMRTColumnHelper<UserRole>()

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      maxSize: 60,
      enableEditing: false,
      Cell: ({ row }) => row.original.name
    })
  ]
  const table = useMantineReactTable({
    ...defaultMRTOptions,
    columns,
    layoutMode: "semantic",
    data: userRoles ?? [],
    enableRowActions: true,
    initialState: {
      density: "xs",
      showGlobalFilter: true,
      pagination: {
        pageIndex: 0,
        pageSize: 25
      }
    },
    renderRowActions: ({ row }) => (
      <Group wrap={"nowrap"} gap={4} align={"center"}>
        {ability.can("view", "settings-user-roles") && (
          <Tooltip label="View">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="green"
              onClick={() => {
                router.workspacePush(`/user-roles/view/${row.original.slug}`)
              }}
            >
              <IconEye size={20} />
            </ActionIcon>
          </Tooltip>
        )}
        {ability.can("edit", "settings-user-roles") && (
          <Tooltip label="Edit">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="blue"
              onClick={() => {
                router.workspacePush(`/user-roles/edit/${row.original.slug}`)
              }}
            >
              <IconEdit size={20} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    ),

    state: {
      isLoading: userRolesQuery.isLoading
    }
  })

  return (
    <TopPageWrapper
      pageTitle="User Roles"
      primaryActions={[
        {
          label: "New User Role",
          action: () => {
            router.workspacePush(`/user-roles/create`)
          },
          visibility: ability.can("add", "settings-user-roles")
        }
      ]}
    >
      <MantineReactTable table={table} />
    </TopPageWrapper>
  )
}
