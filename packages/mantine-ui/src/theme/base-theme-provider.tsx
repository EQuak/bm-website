"use client"

// All packages except `@mantine/hooks` require styles imports
import "../styles/table.css"
import "@mantine/core/styles.css"
import "../styles/globals.css"
import "@mantine/dates/styles.css"
import "@mantine/notifications/styles.css"
import "mantine-react-table/styles.css"
import "@mantine/charts/styles.css"
import "@mantine/spotlight/styles.css"
import "@mantine/dropzone/styles.css"
import "@mantine/tiptap/styles.css"

import type { MantineProviderProps } from "@mantine/core"
import { MantineProvider } from "@mantine/core"
import { DatesProvider } from "@mantine/dates"
import type { ModalsProviderProps } from "@mantine/modals"
import { ModalsProvider } from "@mantine/modals"
import type { NotificationsProps } from "@mantine/notifications"
import { Notifications } from "@mantine/notifications"
import type { FC } from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  mantineProviderProps?: Partial<MantineProviderProps>
  notificationsProps?: Partial<NotificationsProps>
  modalsProviderProps?: Partial<ModalsProviderProps>
}

export const BaseThemeProvider: FC<ThemeProviderProps> = ({
  children,
  notificationsProps,
  mantineProviderProps,
  modalsProviderProps
}: ThemeProviderProps) => {
  return (
    <MantineProvider {...mantineProviderProps}>
      <DatesProvider settings={{ locale: "en", timezone: "UTC" }}>
        <Notifications position="top-right" limit={6} {...notificationsProps} />
        <ModalsProvider {...modalsProviderProps}>{children}</ModalsProvider>
      </DatesProvider>
    </MantineProvider>
  )
}
