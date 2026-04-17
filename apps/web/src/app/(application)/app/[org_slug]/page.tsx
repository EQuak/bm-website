"use client"

import {
  Button,
  Center,
  Modal,
  Stack,
  Title,
  useDisclosure
} from "@repo/mantine-ui"

import { TopPageWrapper } from "#/core/components/top-page-wrapper/TopPageWrapper"
import { useApp } from "#/core/context/AppContext"
import { api } from "#/trpc/react"

export default function AppPage() {
  const { organizationId } = useApp()
  const [profile] = api.profiles.getProfileByUserLogged.useSuspenseQuery({
    organizationId
  })
  const [opened, toggle] = useDisclosure(false)

  return (
    <TopPageWrapper pageTitle={`Home`}>
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

            <Title order={6} ta={"center"} c={"gray.4"} className="text-md">
              To leave feedback, request a change, or report an issue, please
              click the button below.
            </Title>
            <div className="flex w-full justify-center">
              <Button onClick={toggle.open}>Leave Feedback</Button>
            </div>
          </Stack>
        </Center>
      </div>
      <FeedbackModal
        opened={opened}
        onClose={toggle.close}
        email={profile?.user?.email ?? ""}
      />
    </TopPageWrapper>
  )
}

function FeedbackModal({
  opened,
  onClose,
  email
}: {
  opened: boolean
  onClose: () => void
  email: string
}) {
  const encodedEmail = encodeURIComponent(email)
  const iframeUrl = `https://forms.clickup.com/9014472155/f/8cmvvev-674/ZZPN6KZQPFV79KEYQG?email=${encodedEmail}`

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Feedback"
      size="xl"
      centered
      classNames={{
        content: "flex flex-col",
        body: "flex-1"
      }}
    >
      <iframe
        src={iframeUrl}
        width="100%"
        height="600px"
        style={{ border: "0px solid #ccc", maxWidth: "800px" }}
      ></iframe>
      <script
        async
        src="https://app-cdn.clickup.com/assets/js/forms-embed/v1.js"
      ></script>
    </Modal>
  )
}
