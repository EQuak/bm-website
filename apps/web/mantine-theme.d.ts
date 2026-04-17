import type { DefaultMantineColor, MantineColorsTuple } from "@repo/mantine-ui"

type ExtendedCustomColors = "primary" | "wine" | DefaultMantineColor

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>
  }
}
declare module "@repo/mantine-ui" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>
  }
}
