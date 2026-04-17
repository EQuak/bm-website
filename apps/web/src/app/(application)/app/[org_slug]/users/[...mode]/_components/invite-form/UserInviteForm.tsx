"use client"

import { Button, Group, Stack } from "@repo/mantine-ui"
import { TopPageWrapper } from "#/core/components/top-page-wrapper/TopPageWrapper"
import { useUserInviteForm } from "./hooks/useUserInviteForm"
import UserInviteFormInputs from "./UserInviteFormInputs"

export default function UserInviteForm({
  organizationId
}: {
  organizationId: string
}) {
  const { form, asyncEmail, isLoading, onSubmit } =
    useUserInviteForm(organizationId)

  return (
    <TopPageWrapper pageTitle="Invite user">
      <form onSubmit={onSubmit}>
        <Stack>
          <UserInviteFormInputs form={form} asyncEmail={asyncEmail} />
          <Group justify="flex-end">
            <Button type="submit" loading={isLoading}>
              Send invite
            </Button>
          </Group>
        </Stack>
      </form>
    </TopPageWrapper>
  )
}
