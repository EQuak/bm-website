/**
 * @file Developer Tools content component
 * @module app/(platform)/platform/developer-tools/_components
 */

"use client"

import type { RouterOutputs } from "@repo/api"
import {
  Alert,
  Badge,
  Button,
  notifications,
  Paper,
  Select,
  Stack,
  Text,
  Title
} from "@repo/mantine-ui"
import { IconCode, IconUserOff } from "@repo/mantine-ui/icons"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { TopPageWrapper } from "#/core/components/top-page-wrapper/TopPageWrapper"
import {
  DEFAULT_LANDING_PATH,
  workspaceDashboardPath
} from "#/core/config/routes"
import { api } from "#/trpc/react"

const IMPERSONATION_COOKIE = "dev_impersonation"

type PlatformProfile =
  RouterOutputs["platform"]["profilesForImpersonationPicker"][number]

type DeveloperToolsContentProps = {
  realUserId: string
}

/**
 * @component DeveloperToolsContent
 * @description Platform-staff-only tools (impersonation picker lists all orgs).
 */
export default function DeveloperToolsContent({
  realUserId
}: DeveloperToolsContentProps) {
  const [profiles] =
    api.platform.profilesForImpersonationPicker.useSuspenseQuery()
  const [currentCookieValue, setCurrentCookieValue] = useState<
    string | undefined
  >(undefined)
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  )

  useEffect(() => {
    const cookie = Cookies.get(IMPERSONATION_COOKIE)
    setCurrentCookieValue(cookie)

    if (cookie) {
      const [, impersonatedProfileId] = cookie.split(":")
      setSelectedProfileId(impersonatedProfileId ?? null)
    }
  }, [])

  const isImpersonating =
    !!currentCookieValue && currentCookieValue.startsWith(`${realUserId}:`)

  const impersonatedProfileId = isImpersonating
    ? currentCookieValue.split(":")[1]
    : null
  const impersonatedProfile = profiles.find(
    (p) => p.id === impersonatedProfileId
  )

  const handleProfileSelect = (profileId: string | null) => {
    if (!profileId) return

    const target = profiles.find((p) => p.id === profileId)
    const slug = target?._organization?.slug
    if (!slug) {
      notifications.show({
        title: "Cannot impersonate",
        message: "That profile has no organization slug. Check the database.",
        color: "red"
      })
      return
    }

    setSelectedProfileId(profileId)

    Cookies.set(IMPERSONATION_COOKIE, `${realUserId}:${profileId}`, {
      expires: 1,
      sameSite: "strict",
      path: "/"
    })

    setCurrentCookieValue(`${realUserId}:${profileId}`)

    window.location.assign(workspaceDashboardPath(slug))
  }

  const handleStopImpersonating = () => {
    Cookies.remove(IMPERSONATION_COOKIE, { path: "/" })
    setCurrentCookieValue(undefined)
    setSelectedProfileId(null)
    window.location.assign(DEFAULT_LANDING_PATH)
  }

  const profileLabel = (profile: PlatformProfile) =>
    [
      profile.fullName,
      profile._organization?.slug ?? profile._organization?.name,
      profile._aclRole?.name
    ]
      .filter(Boolean)
      .join(" — ")

  const selectData = profiles.map((profile) => ({
    value: profile.id,
    label: profileLabel(profile)
  }))

  return (
    <TopPageWrapper pageTitle="Developer Tools">
      <Stack gap="md" maw={600}>
        {isImpersonating && (
          <Alert
            color="red"
            title="Impersonation Active"
            icon={<IconCode size={16} />}
          >
            <Stack gap="xs">
              <Text size="sm">
                You are currently impersonating{" "}
                <strong>
                  {impersonatedProfile
                    ? profileLabel(impersonatedProfile)
                    : "Unknown Profile"}
                </strong>
              </Text>
              <Text size="xs" c="dimmed">
                All UI and data reflects this profile. Stop impersonating to
                restore your real profile.
              </Text>
            </Stack>
          </Alert>
        )}

        <Paper withBorder p="md" radius="md">
          <Stack gap="sm">
            <div>
              <Title order={5}>Profile Impersonation</Title>
              <Text size="sm" c="dimmed" mt={4}>
                Select any profile in any organization. You will be sent to that
                workspace (URL changes to their org slug) and the app will use
                their role and data.
              </Text>
            </div>

            <Select
              label="Impersonate Profile"
              placeholder="Select a profile to impersonate"
              searchable
              data={selectData}
              value={selectedProfileId}
              onChange={handleProfileSelect}
              clearable={false}
              nothingFoundMessage="No profiles found"
              maxDropdownHeight={300}
            />

            {isImpersonating && (
              <Button
                color="red"
                variant="light"
                leftSection={<IconUserOff size={16} />}
                onClick={handleStopImpersonating}
              >
                Stop Impersonating
              </Button>
            )}
          </Stack>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Stack gap="xs">
            <Title order={6} c="dimmed">
              How it works
            </Title>
            <Text component="div" size="sm" c="dimmed">
              A{" "}
              <Badge size="sm" variant="outline" color="gray">
                dev_impersonation
              </Badge>{" "}
              cookie is set with the format{" "}
              <Badge size="sm" variant="outline" color="gray">
                yourUserId:profileId
              </Badge>
              . The server reads this cookie on each request. Access to this
              page requires Supabase{" "}
              <Badge size="sm" variant="outline" color="gray">
                app_metadata.platform_staff
              </Badge>{" "}
              (or{" "}
              <Badge size="sm" variant="outline" color="gray">
                PLATFORM_STAFF_USER_IDS
              </Badge>{" "}
              in env).
            </Text>
            <Text size="sm" c="dimmed">
              The cookie expires after 24 hours and is bound to your
              authenticated user ID, so it cannot affect other users.
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </TopPageWrapper>
  )
}
