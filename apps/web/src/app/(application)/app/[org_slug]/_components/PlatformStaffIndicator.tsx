"use client"

import { Tooltip } from "@repo/mantine-ui"
import { IconCode } from "@repo/mantine-ui/icons/index"

import { useApp } from "#/core/context/AppContext"

/**
 * Fixed affordance when `app_metadata.platform_staff` is true so internal users
 * remember they may see extra UI and permissions compared to tenant users.
 */
export function PlatformStaffIndicator() {
  const { isPlatformStaff } = useApp()

  if (!isPlatformStaff) {
    return null
  }

  return (
    <Tooltip
      label="Platform staff: you may see extra links, tools, and permissions that normal workspace users do not."
      position="bottom"
      withArrow
      multiline
      maw={280}
    >
      <div
        className="pointer-events-auto fixed top-[max(0.75rem,env(safe-area-inset-top,0px))] right-3 z-[300] flex h-10 w-10 cursor-help items-center justify-center rounded-full bg-violet-600 text-white shadow-md ring-2 ring-white/90 md:top-4 md:right-5 md:h-11 md:w-11 dark:bg-violet-500 dark:ring-zinc-900"
        role="status"
        aria-label="Platform staff mode active"
      >
        <IconCode size={20} stroke={1.5} aria-hidden />
      </div>
    </Tooltip>
  )
}
