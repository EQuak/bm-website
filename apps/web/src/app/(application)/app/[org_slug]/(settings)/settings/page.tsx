"use client"

import { Center, Stack, Title } from "@repo/mantine-ui"

import { TopPageWrapper } from "#/core/components/top-page-wrapper/TopPageWrapper"

export default function SettingsPage() {
  return (
    <TopPageWrapper pageTitle="Settings Page">
      <div className="flex h-[65vh] w-full items-center justify-center">
        <Center>
          <Stack>
            <Title
              order={3}
              ta={"center"}
              c={"gray.6"}
              className="text-lg italic"
            >
              Page in progress
            </Title>
            <Title
              order={6}
              ta={"center"}
              c={"gray.4"}
              className="text-md italic"
            >
              Coming soon...
            </Title>
          </Stack>
        </Center>
      </div>
    </TopPageWrapper>
  )
}
