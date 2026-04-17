"use client"

import { mergeThemeOverrides } from "@repo/mantine-ui"
import { BaseThemeProvider } from "@repo/mantine-ui/theme"

import { defaultTheme } from "../theme/themes"

import "../styles/custom-table.css"

// Add theme overrides here if needed
const theme = mergeThemeOverrides(defaultTheme)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <BaseThemeProvider
      mantineProviderProps={{ theme, defaultColorScheme: "light" }}
      notificationsProps={{
        position: "top-right",
        limit: 4
      }}
    >
      {children}
    </BaseThemeProvider>
  )
}
