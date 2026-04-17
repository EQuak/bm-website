import {
  Avatar,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  Modal,
  useDisclosure
} from "@repo/mantine-ui"
import { IconUserOff } from "@repo/mantine-ui/icons"
import Cookies from "js-cookie"

import { logout } from "#/app/(auth)/_funcs/login"
import WorkspaceLink from "#/core/components/WorkspaceLink"
import { DEFAULT_LANDING_PATH } from "#/core/config/routes"

export default function UserMenuDropdown({
  profile,
  isImpersonating = false
}: {
  profile: {
    firstName: string
    lastName: string
    avatar?: string
    email: string
  }
  isImpersonating?: boolean
}) {
  const [opened, toggle] = useDisclosure(false)

  const handleLogout = async () => {
    await logout()
  }

  const handleStopImpersonating = () => {
    Cookies.remove("dev_impersonation", { path: "/" })
    window.location.assign(DEFAULT_LANDING_PATH)
  }

  return (
    <>
      <MenuDropdown suppressHydrationWarning>
        <MenuLabel>
          <div className="flex items-center justify-between gap-2">
            <Avatar
              src={profile.avatar ?? ""}
              w={36}
              h={36}
              radius={"md"}
              alt={`${profile.firstName} ${profile.lastName} avatar`}
            >
              {profile.firstName[0]}
              {profile.lastName[0]}
            </Avatar>

            <div className="flex flex-1 flex-col gap-0 overflow-hidden">
              <span className="truncate font-semibold text-sm">
                {profile.firstName} {profile.lastName}
              </span>
              <span className="truncate text-xs">{profile.email}</span>
            </div>
          </div>
        </MenuLabel>
        <MenuDivider />
        {/* <MenuItem>Messages</MenuItem>
      <MenuItem>Notifications</MenuItem> */}
        <MenuItem onClick={toggle.open}>Feedback</MenuItem>
        <MenuItem href={"/profile/view"} component={WorkspaceLink}>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
        {isImpersonating && (
          <>
            <MenuDivider />
            <MenuItem
              color="red"
              leftSection={<IconUserOff size={16} />}
              onClick={handleStopImpersonating}
            >
              Stop Impersonating
            </MenuItem>
          </>
        )}
      </MenuDropdown>
      <FeedbackModal
        opened={opened}
        onClose={toggle.close}
        email={profile.email}
      />
    </>
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
