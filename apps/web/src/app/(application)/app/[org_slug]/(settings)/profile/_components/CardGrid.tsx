"use client"

import { Badge, Box, Card, GridCol, Stack } from "@repo/mantine-ui"
import AVATAR_PLACEHOLDER from "assets/images/avatar-placeholder.png"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

import { LabelWithTitle } from "#/core/components/LabelTitle"
import { useApp } from "#/core/context/AppContext"
import { api } from "#/trpc/react"

export function CardGrid() {
  const { organizationId } = useApp()
  const searchParams = useSearchParams()
  const editMode = searchParams.get("editMode")
  const [profile] = api.profiles.getProfileByUserLogged.useSuspenseQuery({
    organizationId
  })
  return (
    <GridCol span={"auto"} className="relative">
      {editMode === "true" && (
        <Badge
          radius={"sm"}
          variant="outline"
          color="gray"
          bg={"white"}
          size="xs"
          className="-translate-x-1/2 absolute top-0 left-1/2 z-20 transform"
        >
          Preview Mode
        </Badge>
      )}
      <Card withBorder>
        <Stack gap={8}>
          <Box className="max-w relative h-[300px] w-full overflow-hidden rounded-md md:h-[200px]">
            <Image
              src={profile?.avatar ? profile.avatar : AVATAR_PLACEHOLDER}
              alt="Profile"
              priority
              sizes="(max-width: 768px) 80vw, (max-width: 1200px) 30vw, 33vw"
              fill
              className="rounded-md object-cover"
            />
          </Box>
          <LabelWithTitle
            label="Full Name"
            value={`${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim()}
          />
          <LabelWithTitle
            label="Email"
            value={profile?.user?.email ?? ""}
            withCopy={editMode !== "true"}
          />
          <LabelWithTitle
            label="Phone"
            value={profile?.phone ?? ""}
            isPhone
            withCopy={editMode !== "true"}
          />
        </Stack>
      </Card>
    </GridCol>
  )
}
