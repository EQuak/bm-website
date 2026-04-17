"use client"

import {
  Box,
  useComputedColorScheme,
  useMantineColorScheme
} from "@mantine/core"
import { IconMoon, IconSun } from "@tabler/icons-react"
import type { FC } from "react"

export const ColorSchemeToggle: FC = () => {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true
  })

  const handleToggleScheme = () => {
    if (computedColorScheme === "dark") return setColorScheme("light")

    return setColorScheme("dark")
  }

  return (
    <Box
      className="group relative flex size-[30px] cursor-pointer items-center justify-center text-mtn-primary-filled dark:text-mtn-primary-0"
      onClick={handleToggleScheme}
    >
      <IconSun
        data-active={computedColorScheme === "light"}
        className="group-hover:pulse absolute inset-0 mx-auto my-auto hidden size-[30px] transition-all data-active:block"
      />
      <IconMoon
        data-active={computedColorScheme === "dark"}
        className="absolute inset-0 mx-auto my-auto hidden size-[28px] transition-all group-hover:animate-pulse data-active:block"
      />
      {/* <IconSun className='absolute size-[32px] rotate-0 scale-100 transition-all group-hover:scale-105 group-hover:animate-spin dark:hidden dark:-rotate-90' />
      <IconMoon className='absolute size-[28px] rotate-90 scale-0 transition-all group-hover:rotate-0 group-hover:scale-105 dark:rotate-0 dark:blo' /> */}
      <span className="sr-only">Toggle theme</span>
    </Box>
  )
}
