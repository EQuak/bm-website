/**
 * @file Build navigation lookup map from site.ts
 * @module utils/breadcrumb/buildNavLookupMap
 *
 * Converts hierarchical navigation from site.ts into a flat Map
 * for efficient path-to-label lookups
 */

import { normalizePath } from "#/core/config/routes"
import { siteConfig } from "#/core/config/site"
import type { NavItems } from "#/types"
import type { NavLookupEntry, NavLookupMap } from "./breadcrumb.types"

/**
 * Recursively process navigation items and add to the lookup map
 */
function processNavItem(item: NavItems, map: NavLookupMap): void {
  // Normalize the href for consistent matching
  const normalizedHref = normalizePath(item.href)

  const entry: NavLookupEntry = {
    href: item.href,
    isLeaf: !item.links || item.links.length === 0,
    label: item.label
  }

  map.set(normalizedHref, entry)

  // Recursively process child links
  if (item.links && item.links.length > 0) {
    for (const link of item.links) {
      processNavItem(link, map)
    }
  }
}

/**
 * Build the navigation lookup map from site.ts configuration
 * Processes both mainNav and betaNav
 */
function buildNavLookupMap(): NavLookupMap {
  const map: NavLookupMap = new Map()

  // Process main navigation
  for (const item of siteConfig.mainNav) {
    processNavItem(item, map)
  }

  // Process beta navigation if exists
  if (siteConfig.betaNav) {
    for (const item of siteConfig.betaNav) {
      processNavItem(item, map)
    }
  }

  return map
}

// Memoized singleton instance
let cachedMap: NavLookupMap | null = null

/**
 * Get the navigation lookup map (memoized)
 * Returns a Map from normalized paths to NavLookupEntry
 */
export function getNavLookupMap(): NavLookupMap {
  if (!cachedMap) {
    cachedMap = buildNavLookupMap()
  }
  return cachedMap
}

/**
 * Look up a path in the navigation map
 * @param href The path to look up (will be normalized)
 * @returns NavLookupEntry if found, undefined otherwise
 */
export function lookupNavEntry(href: string): NavLookupEntry | undefined {
  const map = getNavLookupMap()
  const normalizedHref = normalizePath(href)
  return map.get(normalizedHref)
}

/**
 * Clear the cached map (useful for testing or hot reload)
 */
export function clearNavLookupCache(): void {
  cachedMap = null
}
