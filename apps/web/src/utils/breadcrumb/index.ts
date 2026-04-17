/**
 * @file Breadcrumb utility module
 * @module utils/breadcrumb
 *
 * Builds breadcrumb segments from URL pathname using site.ts as source of truth
 */

import type { BreadcrumbConfig, BreadcrumbSegment } from "./breadcrumb.types"
import { lookupDictionaryLabel } from "./breadcrumbDictionary"
import { lookupNavEntry } from "./buildNavLookupMap"
import { formatDynamicParameter, isDynamicParameter } from "./segmentDetectors"

// Re-export types
export type { BreadcrumbConfig, BreadcrumbSegment } from "./breadcrumb.types"

const DEFAULT_CONFIG: Required<BreadcrumbConfig> = {
  collapseThreshold: 4,
  maxLabelLength: 25,
  showHomeSegment: true
}

/**
 * Build accumulated path for a segment
 * Handles beta prefix routes correctly
 */
function buildAccumulatedPath(
  segments: string[],
  index: number,
  hasBetaPrefix: boolean
): string {
  if (hasBetaPrefix && index === 0) {
    // First segment with beta prefix
    return `/${segments[0]}`
  } else if (hasBetaPrefix) {
    // Subsequent segments in beta routes - rebuild with beta prefix
    return `/beta_${segments.slice(1, index + 1).join("/")}`
  } else {
    // Normal routes
    return `/${segments.slice(0, index + 1).join("/")}`
  }
}

/**
 * Generate auto-formatted label from segment
 * Converts kebab-case/snake_case to Title Case
 */
function generateAutoLabel(segment: string): string {
  return segment
    .replace(/^beta_/, "") // Remove beta_ prefix for label
    .replace(/[-_]/g, " ") // Convert hyphens and underscores to spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()) // Title case each word
}

/**
 * Truncate label if exceeds max length
 */
function truncateLabel(
  label: string,
  maxLength: number
): { label: string; truncated: boolean; fullLabel?: string } {
  if (label.length <= maxLength) {
    return { label, truncated: false }
  }
  return {
    fullLabel: label,
    label: label.slice(0, maxLength - 3) + "...",
    truncated: true
  }
}

/**
 * Resolve a single segment to a BreadcrumbSegment
 */
function resolveSegment(
  segment: string,
  href: string,
  config: Required<BreadcrumbConfig>
): BreadcrumbSegment {
  // 1. Check for special "app" segment (Home)
  if (segment === "app" || segment === "beta_app") {
    const { label, truncated, fullLabel } = truncateLabel(
      "Home",
      config.maxLabelLength
    )
    return {
      fullLabel,
      href,
      isDynamic: false,
      isLink: true,
      label,
      source: "dictionary",
      truncated
    }
  }

  // 2. Check if it's a dynamic parameter (UUID, ID)
  if (isDynamicParameter(segment)) {
    const dynamicLabel = formatDynamicParameter(segment)
    return {
      href,
      isDynamic: true,
      isLink: false,
      label: dynamicLabel,
      source: "auto",
      truncated: false
    }
  }

  // 3. Try to find in site.ts navigation map
  const navEntry = lookupNavEntry(href)
  if (navEntry) {
    const { label, truncated, fullLabel } = truncateLabel(
      navEntry.label,
      config.maxLabelLength
    )
    return {
      fullLabel,
      href,
      isDynamic: false,
      isLink: navEntry.isLeaf,
      label,
      source: "site",
      truncated
    }
  }

  // 4. Try the dictionary
  const dictLabel = lookupDictionaryLabel(segment)
  if (dictLabel) {
    const { label, truncated, fullLabel } = truncateLabel(
      dictLabel,
      config.maxLabelLength
    )
    return {
      fullLabel,
      href,
      isDynamic: false,
      isLink: false,
      label,
      source: "dictionary",
      truncated
    }
  }

  // 5. Fall back to auto-generated label
  const autoLabel = generateAutoLabel(segment)
  const { label, truncated, fullLabel } = truncateLabel(
    autoLabel,
    config.maxLabelLength
  )
  return {
    fullLabel,
    href,
    isDynamic: false,
    isLink: false,
    label,
    source: "auto",
    truncated
  }
}

/**
 * Build breadcrumb segments from a pathname
 *
 * @param pathname Current URL pathname (e.g., "/app/users/edit/123")
 * @param config Optional configuration options
 * @returns Array of BreadcrumbSegment objects
 *
 * @example
 * const segments = buildBreadcrumbs("/app/users/list")
 * // Returns: [
 * //   { label: "Home", href: "/app", isLink: true, ... },
 * //   { label: "Users", href: "/app/users", isLink: false, ... },
 * //   { label: "All Users", href: "/app/users/list", isLink: true, ... }
 * // ]
 */
export function buildBreadcrumbs(
  pathname: string,
  config: BreadcrumbConfig = {}
): BreadcrumbSegment[] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  // Parse pathname into segments
  const rawSegments = pathname.split("/").filter(Boolean)
  const segments: BreadcrumbSegment[] = []

  // Detect beta prefix
  const hasBetaPrefix =
    rawSegments[0] === "beta_app" || rawSegments[0] === "beta_auth"

  const orgSlug =
    rawSegments[0] === "app" && rawSegments.length > 1
      ? rawSegments[1]
      : undefined

  // Build accumulated path for each segment
  for (let i = 0; i < rawSegments.length; i++) {
    const segment = rawSegments[i]
    if (!segment) continue

    // Skip org slug segment: /app/[org_slug]/...
    if (rawSegments[0] === "app" && i === 1 && orgSlug) {
      continue
    }

    // Skip home segment if config says so
    if (
      !finalConfig.showHomeSegment &&
      i === 0 &&
      (segment === "app" || segment === "beta_app")
    ) {
      continue
    }

    let href = buildAccumulatedPath(rawSegments, i, hasBetaPrefix)
    if (i === 0 && segment === "app" && orgSlug) {
      href = `/app/${orgSlug}/dashboard`
    }

    const breadcrumbSegment = resolveSegment(segment, href, finalConfig)
    segments.push(breadcrumbSegment)
  }

  return segments
}

/**
 * Get visible and collapsed segments based on threshold
 */
export function getCollapsedSegments(
  segments: BreadcrumbSegment[],
  threshold: number = DEFAULT_CONFIG.collapseThreshold
): {
  visibleSegments: BreadcrumbSegment[]
  collapsedSegments: BreadcrumbSegment[]
  shouldCollapse: boolean
} {
  if (segments.length <= threshold) {
    return {
      collapsedSegments: [],
      shouldCollapse: false,
      visibleSegments: segments
    }
  }

  // Show: [first] ... [last-1] [last]
  return {
    collapsedSegments: segments.slice(1, -2),
    shouldCollapse: true,
    visibleSegments: [segments[0]!, ...segments.slice(-2)]
  }
}
