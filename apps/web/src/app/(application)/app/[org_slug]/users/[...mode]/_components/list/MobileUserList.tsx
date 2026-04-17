"use client"

import {
  Button,
  Group,
  rem,
  Select,
  Skeleton,
  Stack,
  Switch,
  Text,
  TextInput,
  Tooltip,
  useDebouncedValue,
  useForm
} from "@repo/mantine-ui"
import { IconBoxOff, IconSearch } from "@repo/mantine-ui/icons/index"
import { cn } from "@repo/mantine-ui/utils/cn"

import { useApp } from "#/core/context/AppContext"
import { api } from "#/trpc/react"
import UserCard from "./UserCard"

export default function MobileUsersList({ isMobile }: { isMobile: boolean }) {
  const { organizationId } = useApp()
  const states = useForm<{
    search: string
    roleSlug: string | undefined
    jobPositionId: string | undefined
    autoSearch: boolean
    limit: number
    status: string
  }>({
    initialValues: {
      search: "",
      roleSlug: "",
      jobPositionId: "",
      autoSearch: true,
      limit: 20,
      status: "active"
    }
  })
  const searchText = states.getValues().search
  const roleSlug = states.getValues().roleSlug ?? ""
  const _jobPositionId = states.getValues().jobPositionId ?? ""
  const limit = states.getValues().limit
  const userStatus = states.getValues().status
  const [debouncedSearch] = useDebouncedValue(searchText, 1000)
  const [roles] = api.aclsRoles.getAllAclsRoles.useSuspenseQuery()

  const usersData =
    api.profiles.getProfilesWithSearchAndFiltersInfinite.useInfiniteQuery(
      {
        organizationId,
        searchText: debouncedSearch,
        roleSlug,
        limit,
        inactive: userStatus === "active" ? false : true
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        enabled: isMobile
      }
    )
  const hasUsers =
    usersData.data?.pages[0]?.employees &&
    usersData.data.pages[0]?.employees.length > 0

  const roleOptions =
    roles?.map((role) => ({
      value: role.slug,
      label: role.name
    })) ?? []

  return (
    <Stack>
      <Group gap={"xs"}>
        <Select
          searchable
          size="xs"
          clearable
          readOnly={usersData.isLoading}
          label="Role"
          placeholder="Select role"
          data={roleOptions}
          comboboxProps={{
            shadow: "md"
          }}
          {...states.getInputProps("roleSlug")}
        />
        <Select
          size="xs"
          readOnly={usersData.isLoading}
          label="User Status"
          data={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" }
          ]}
          comboboxProps={{
            shadow: "md"
          }}
          {...states.getInputProps("status")}
        />
        <TextInput
          size="xs"
          leftSection={<IconSearch size={16} />}
          readOnly={usersData.isLoading}
          classNames={{
            label: "w-full"
          }}
          label={
            <Group justify="space-between">
              <Text fz={"sm"} fw={500}>
                Global Search
              </Text>
              <Tooltip
                fz={"xs"}
                w={rem(200)}
                multiline
                position="top"
                label="Will search as you type with some delay"
                refProp="rootRef"
              >
                <Switch
                  label="Auto Search"
                  labelPosition="left"
                  classNames={{
                    label: cn(
                      states.getValues().autoSearch
                        ? "text-mtn-primary-filled"
                        : "text-mtn-dimmed"
                    )
                  }}
                  size="xs"
                  {...states.getInputProps("autoSearch", {
                    type: "checkbox"
                  })}
                />
              </Tooltip>
            </Group>
          }
          placeholder="Search"
          rightSectionWidth={rem(80)}
          rightSection={
            <Button
              size="compact-xs"
              variant="light"
              disabled={
                states.getValues().autoSearch ||
                states.getValues().search.length < 3
              }
              loading={usersData.isLoading}
            >
              Search
            </Button>
          }
          {...states.getInputProps("search")}
        />
      </Group>
      {usersData.isLoading ? (
        <Stack gap={"xs"}>
          {Array.from({ length: limit }).map((_, index) => (
            <Skeleton key={index} height={rem(80)} radius={"md"} w={"100%"} />
          ))}
        </Stack>
      ) : !hasUsers ? (
        <EmptyStateComponent />
      ) : (
        <>
          {usersData.data?.pages.map((page, pageIndex) => (
            <Stack key={pageIndex}>
              {page?.employees.map((employee) => {
                return <UserCard key={employee.id} user={employee} />
              })}
            </Stack>
          ))}

          {usersData.hasNextPage && (
            <div className="flex w-full justify-center">
              <Button
                variant="light"
                mt={rem(8)}
                size="compact-sm"
                px={"md"}
                radius={"lg"}
                onClick={() => usersData.fetchNextPage()}
                loading={usersData.isFetchingNextPage}
                disabled={usersData.isFetchingNextPage}
              >
                Load More...
              </Button>
            </div>
          )}
        </>
      )}
    </Stack>
  )
}

function EmptyStateComponent() {
  return (
    <Stack
      align="center"
      justify="center"
      h={200}
      bg="gray.0"
      style={{ borderRadius: 8 }}
    >
      <IconBoxOff size={48} color="gray" opacity={0.5} />
      <Text c="dimmed" ta="center">
        No users found matching your search criteria.
        <br />
        Try adjusting your search or filters.
      </Text>
    </Stack>
  )
}
