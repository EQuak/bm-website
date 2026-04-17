/** Must match `AppShell` `header={{ height }}` in `SiteShell.tsx` */
export const SITE_HEADER_HEIGHT_PX = 72

/**
 * Extra space below the fixed header before hero / first-section copy.
 * Used by `MarketingFirstSection`, image heroes (home, services), etc.
 */
export const MARKETING_HERO_CONTENT_OFFSET_PX = {
  base: 24,
  md: 32
} as const

/** Bottom padding inside the primary hero / lead band (shared across marketing). */
export const MARKETING_HERO_PADDING_BOTTOM_PX = {
  base: 48,
  md: 64
} as const

/** Floor height for the home hero band so the background image still reads; keep modest to avoid a deep empty tail. */
export const HOME_HERO_MIN_HEIGHT_PX = {
  base: 400,
  sm: 440,
  md: 480
} as const

/** `padding-top` for full-bleed heroes: clears header + inset. */
export const MARKETING_HERO_PADDING_TOP_PX = {
  base: SITE_HEADER_HEIGHT_PX + MARKETING_HERO_CONTENT_OFFSET_PX.base,
  md: SITE_HEADER_HEIGHT_PX + MARKETING_HERO_CONTENT_OFFSET_PX.md
} as const
