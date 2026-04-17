import { Avatar, Burger, Menu, MenuTarget } from "@repo/mantine-ui"
import { cn } from "@repo/mantine-ui/utils/cn"

import { useApp } from "#/core/context/AppContext"
import { useThemeStore } from "#/providers/theme-store-provider"
import { api } from "#/trpc/react"
import UserMenuDropdown from "./user-menu-dropdown"

export const ShellHeader = ({
  toggleSidebar,
  sidebarOpened
}: {
  toggleSidebar: () => void
  sidebarOpened: boolean
}) => {
  const { organizationId } = useApp()
  const headerState = useThemeStore((store) => store.headerState)
  const [profile] = api.profiles.getProfileByUserLogged.useSuspenseQuery({
    organizationId
  })

  const scrolled = headerState === "scrolled"

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-0 mt-0 flex items-center transition-all duration-300 ease-in-out md:top-2 md:mt-2 lg:hidden",
        scrolled && "md:mx-4 md:mt-0"
      )}
    >
      <div
        className={cn(
          "flex w-full items-center justify-between rounded-none border-0 border-zinc-950/5 border-b bg-white/95 px-4 py-2 backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-white hover:backdrop-blur-none md:rounded-md md:border md:bg-white/90",
          scrolled && "border-solid shadow-sm md:px-2"
        )}
        data-headroom={scrolled}
      >
        <Burger
          className="flex items-center justify-center rounded-md bg-mtn-gray-1 [--burger-color:var(--mantine-color-primary-6)] hover:[--burger-color:var(--mantine-color-primary-7)]"
          size={"sm"}
          color="wine.5"
          h={38}
          w={38}
          opened={sidebarOpened}
          onClick={toggleSidebar}
        />
        <Menu
          width={224}
          position={"left-start"}
          withArrow
          arrowSize={12}
          arrowPosition="center"
          shadow="md"
          offset={8}
        >
          <MenuTarget>
            <Avatar
              src={profile?.avatar ?? ""}
              alt={`${profile?.firstName} ${profile?.lastName} avatar`}
              w={36}
              h={36}
              radius={"md"}
              className="mr-1 cursor-pointer object-cover ring-1 ring-mtn-gray-3 ring-offset-2 transition-all duration-300 ease-in-out hover:ring-mtn-gray-4 hover:ring-offset-0"
            >
              {profile?.firstName[0]}
              {profile?.lastName[0]}
            </Avatar>
          </MenuTarget>
          <UserMenuDropdown
            profile={{
              firstName: profile?.firstName ?? "",
              lastName: profile?.lastName ?? "",
              avatar: profile?.avatar ?? "",
              email: profile?.user?.email ?? ""
            }}
          />
        </Menu>
      </div>
    </header>
  )
}
