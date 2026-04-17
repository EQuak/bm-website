"use client"

import { Box, type BoxProps } from "@repo/mantine-ui"
import type { ReactNode } from "react"

import {
  MARKETING_HERO_CONTENT_OFFSET_PX,
  MARKETING_HERO_PADDING_BOTTOM_PX,
  SITE_HEADER_HEIGHT_PX
} from "./layout-constants"

type MarketingFirstSectionProps = Omit<BoxProps, "pt"> & {
  children: ReactNode
  /** Overrides default top padding below the header bar */
  pt?: BoxProps["pt"]
  /** Overrides default bottom padding of the lead block */
  pb?: BoxProps["pb"]
  /**
   * Extra padding below the fixed header (added to `SITE_HEADER_HEIGHT_PX`).
   * Defaults match image heroes on home and services.
   */
  contentOffset?: { base?: number; md?: number }
}

/**
 * First block on marketing subpages: extends under the fixed header (like the home hero)
 * while keeping titles below the bar. Works with `AppShell.Main` top padding in `SiteShell`.
 */
export function MarketingFirstSection({
  contentOffset = MARKETING_HERO_CONTENT_OFFSET_PX,
  pb = MARKETING_HERO_PADDING_BOTTOM_PX,
  pt,
  style,
  children,
  ...rest
}: MarketingFirstSectionProps) {
  const mergedPt =
    pt ??
    ({
      base: SITE_HEADER_HEIGHT_PX + (contentOffset.base ?? 0),
      md: SITE_HEADER_HEIGHT_PX + (contentOffset.md ?? 0)
    } as const)

  return (
    <Box
      pt={mergedPt}
      pb={pb}
      style={{
        marginTop: `-${SITE_HEADER_HEIGHT_PX}px`,
        ...style
      }}
      {...rest}
    >
      {children}
    </Box>
  )
}
