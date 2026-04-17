"use client"

import { GridCol, Stack, Tabs } from "@repo/mantine-ui"
import { useParams } from "next/navigation"
import { useWorkspaceRouter } from "#/hooks/useWorkspaceRouter"
import { ProfileViewTab } from "./profile-view-tab/ProfileViewTab"
import type { ProfilePageMode } from "./profile-view-tab/profilePage.type"
import { SecurityTab } from "./security-tab/SecurityTab"

export function TabsGrid() {
  const router = useWorkspaceRouter()
  const { mode } = useParams()
  return (
    <GridCol span={{ base: 12, sm: 8, lg: 9 }}>
      <Tabs
        value={(mode as ProfilePageMode) ?? "view"}
        onChange={(value) => router.workspacePush(`/profile/${value}`)}
      >
        <Stack>
          <Tabs.List>
            <Tabs.Tab value="view">View</Tabs.Tab>
            <Tabs.Tab value="security">Security</Tabs.Tab>
            <Tabs.Tab value="notifications" disabled>
              Notifications
            </Tabs.Tab>
          </Tabs.List>
          <ProfileViewTab value="view" />
          <SecurityTab value="security" />
          <NotificationsTab value="notifications" />
        </Stack>
      </Tabs>
    </GridCol>
  )
}

function NotificationsTab({ value }: { value: NonNullable<ProfilePageMode> }) {
  return <Tabs.Panel value={value}>Notifications</Tabs.Panel>
}
