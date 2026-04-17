import { Stack } from "@repo/mantine-ui"

import { TopPageWrapper } from "#/core/components/top-page-wrapper/TopPageWrapper"
import { PageGrid } from "./_components/PageGrid"

export default function ProfilePage() {
  return (
    <TopPageWrapper
      pageTitle="Profile"
      primaryActions={[
        {
          label: "Edit Profile",
          href: "/profile/edit",
          workspaceHref: true
        }
      ]}
    >
      <Stack>
        <PageGrid />
      </Stack>
    </TopPageWrapper>
  )
}
