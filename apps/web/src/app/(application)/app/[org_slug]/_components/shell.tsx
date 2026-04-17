"use client"

import { cn } from "@repo/mantine-ui/utils/cn"

import { useSidebarToggle } from "#/hooks/useSidebarToggle"
import { PlatformStaffIndicator } from "./PlatformStaffIndicator"
import { ShellHeader } from "./shell-header"
import { ShellSidebar } from "./shell-sidebar"
import { ShellSidebarMobile } from "./shell-sidebar-mobile"

export const WorkspaceShell = ({ children }: { children: React.ReactNode }) => {
  const { sidebarIsOpen, sidebarHandlers } = useSidebarToggle(false)
  return (
    <div
      className={cn(
        "relative isolate flex min-h-svh w-full bg-white max-lg:flex-col md:bg-mtn-gray-1"
      )}
    >
      {/* Sidebar */}
      <ShellSidebar />
      {/* Header */}

      {/* Main Content */}
      <main className="flex min-h-dvh flex-1 flex-col transition-all duration-300 ease-in-out md:min-w-0 md:pt-2 md:pr-2 md:pb-2 md:pl-[72px] lg:pl-60">
        <div className="flex grow flex-col md:rounded-md md:bg-white md:shadow-md md:ring-1 md:ring-zinc-950/5 dark:md:bg-zinc-900 dark:md:ring-white/10">
          <ShellHeader
            toggleSidebar={sidebarHandlers.toggle}
            sidebarOpened={sidebarIsOpen}
          />
          <section className="flex h-full flex-1 flex-col p-4">
            {children}
          </section>
        </div>
      </main>

      <ShellSidebarMobile
        sidebarIsOpen={sidebarIsOpen}
        sidebarHandlers={sidebarHandlers}
      />

      <PlatformStaffIndicator />
    </div>
  )
}
