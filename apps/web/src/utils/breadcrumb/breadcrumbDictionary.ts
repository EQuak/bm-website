/**
 * @file Breadcrumb dictionary for common words and segments
 * @module utils/breadcrumb/breadcrumbDictionary
 *
 * Secondary lookup for labels when not found in site.ts
 * Priority: site.ts > dictionary > auto-format
 */

/**
 * Dictionary mapping URL segments to display labels
 * These are used when a segment is not found in the site.ts navigation
 */
export const breadcrumbDictionary: Record<string, string> = {
  // CRUD actions
  list: "List",
  create: "Create",
  new: "New",
  edit: "Edit",
  view: "View",
  add: "Add",
  update: "Update",
  delete: "Delete",

  // Common module segments
  "my-profile": "My Profile",
  "management-list": "Management",
  "group-list": "Transactions",
  dashboard: "Dashboard",
  settings: "Settings",
  profile: "Profile",

  // Users specific
  users: "Users",

  "user-roles": "User Roles",

  // Route prefixes (handled specially)
  app: "Home",
  beta_app: "Home"
}

/**
 * Look up a label in the dictionary
 * @param segment URL segment to look up
 * @returns Label if found, undefined otherwise
 */
export function lookupDictionaryLabel(segment: string): string | undefined {
  return breadcrumbDictionary[segment]
}
