"use client"

import { Box, type BoxProps } from "@repo/mantine-ui"
import Image from "next/image"

type BmMonogramLogoProps = {
  /** Pixel height (logo preserves aspect ratio) */
  size?: number
} & Omit<BoxProps, "children">

export function BmMonogramLogo({ size = 40, ...rest }: BmMonogramLogoProps) {
  // `bm-logo-cropped.png` is 820×520
  const aspectRatio = 820 / 520
  const width = Math.round(size * aspectRatio)
  const padding = Math.max(2, Math.round(size * 0.06))

  return (
    <Box
      w={width}
      h={size}
      miw={width}
      flex="0 0 auto"
      {...rest}
      pos="relative"
      style={{ overflow: "hidden" }}
      role="img"
      aria-label="B Miller Consulting LLC"
    >
      <Box
        pos="absolute"
        style={{
          top: padding,
          left: padding,
          right: padding,
          bottom: padding
        }}
      >
        <Image
          src="/bm-logo-cropped.png"
          alt="B Miller Consulting LLC"
          fill
          sizes={`${width}px`}
          style={{ objectFit: "contain" }}
          priority={size >= 64}
        />
      </Box>
    </Box>
  )
}
