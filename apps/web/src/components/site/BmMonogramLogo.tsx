"use client"

import type { BoxProps } from "@repo/mantine-ui"
import { LogoVariant14 } from "./logo-lab/LogoVariants"

type BmMonogramLogoProps = {
  /** Pixel width/height (square) */
  size?: number
} & Omit<BoxProps, "children">

/**
 * Blake Miller site mark — same as logo-lab **variant 14** (black tile, white BM, red rule).
 */
export function BmMonogramLogo({ size = 40, ...rest }: BmMonogramLogoProps) {
  return <LogoVariant14 size={size} {...rest} />
}
