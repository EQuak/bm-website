/**
 * @file Breadcrumb utility types
 * @module utils/breadcrumb
 */

/**
 * Represents a single breadcrumb segment with display and navigation info
 */
export type BreadcrumbSegment = {
  /** Display label for the breadcrumb */
  label: string
  /** Full URL path to this segment */
  href: string
  /** Whether this segment should be a clickable link */
  isLink: boolean
  /** Whether this is a dynamic parameter (UUID, numeric ID) */
  isDynamic: boolean
  /** Whether the label was truncated */
  truncated?: boolean
  /** Original full label if truncated */
  fullLabel?: string
  /** Source of the label resolution */
  source: "site" | "dictionary" | "auto"
}

/**
 * Entry in the navigation lookup map built from site.ts
 */
export type NavLookupEntry = {
  /** Display label from site.ts */
  label: string
  /** Original href from site.ts */
  href: string
  /** Whether this is a leaf item (no children = valid link target) */
  isLeaf: boolean
}

/**
 * Configuration options for breadcrumb generation
 */
export type BreadcrumbConfig = {
  /** Maximum characters for a label before truncation (default: 25) */
  maxLabelLength?: number
  /** Number of segments before collapsing (default: 4) */
  collapseThreshold?: number
  /** Whether to show the Home segment (default: true) */
  showHomeSegment?: boolean
}

/**
 * Map from normalized path to navigation entry
 */
export type NavLookupMap = Map<string, NavLookupEntry>
