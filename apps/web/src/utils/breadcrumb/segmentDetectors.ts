/**
 * @file Segment detection utilities for breadcrumb
 * @module utils/breadcrumb/segmentDetectors
 *
 * Detects dynamic URL parameters like UUIDs and numeric IDs
 */

/** UUID v4 and v7 pattern */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Numeric ID pattern (1-20 digits) */
const NUMERIC_ID_PATTERN = /^\d{1,20}$/

/**
 * Check if a segment is a UUID (v4 or v7)
 */
export function isUUID(segment: string): boolean {
  return UUID_PATTERN.test(segment)
}

/**
 * Check if a segment is a numeric ID
 */
export function isNumericId(segment: string): boolean {
  return NUMERIC_ID_PATTERN.test(segment)
}

/**
 * Check if a segment is a dynamic parameter (UUID or numeric ID)
 * These should not be formatted and should not be clickable links
 */
export function isDynamicParameter(segment: string): boolean {
  return isUUID(segment) || isNumericId(segment)
}

/**
 * Format a dynamic parameter for display
 * UUIDs are truncated, numeric IDs shown as-is
 */
export function formatDynamicParameter(segment: string): string {
  if (isUUID(segment)) {
    // Show first 8 characters of UUID with ellipsis
    return `${segment.slice(0, 8)}...`
  }
  // Numeric IDs and others shown as-is
  return segment
}
