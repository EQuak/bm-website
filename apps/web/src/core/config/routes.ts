// Name of the default route
export const DEFAULT_ROUTE_NAME = "app"

// Path of the default route
export const DEFAULT_ROUTE_PATH = `/${DEFAULT_ROUTE_NAME}`

/**
 * Where authenticated users land after login (OAuth callback, client redirects).
 * Resolves to `/app/<org_slug>/...` via `app/page.tsx` server redirect.
 */
export const DEFAULT_LANDING_PATH = DEFAULT_ROUTE_PATH

/** Full path to the main dashboard for a workspace. */
export function workspaceDashboardPath(orgSlug: string): string {
  return `${DEFAULT_ROUTE_PATH}/${orgSlug}/dashboard`
}

// Match /app/[org_slug]/...
export const DEFAULT_ROUTE_PATTERN = new RegExp(
  `^/${DEFAULT_ROUTE_NAME}/([^/]+)(/.*)?$`
)

// Remove query string from the path
export function removeQueryString(path: string) {
  return path.split("?")[0] ?? path
}

/**
 * Normalize the pathname to remove the /app/[org_slug] prefix and query string
 */
export const normalizePath = (pathname: string, clearQueryString = true) => {
  if (clearQueryString) {
    pathname = removeQueryString(pathname)
  }
  const match = pathname.match(DEFAULT_ROUTE_PATTERN)
  if (match) {
    let normalizedPath = match[2] ?? "/"
    if (normalizedPath === "") normalizedPath = "/"
    normalizedPath = normalizedPath.replace(/\/$/, "") || "/"
    return normalizedPath.startsWith("/")
      ? normalizedPath
      : `/${normalizedPath}`
  }
  return pathname.replace(/\/$/, "")
}

export const pathsMatching = (
  urlPathname: string,
  pathToMatch: string,
  exact = true
) => {
  const normalizedUrlPathname = normalizePath(urlPathname)
  const normalizedPathToMatch = normalizePath(pathToMatch)

  // Get base path (first two segments)
  const basePath = normalizedPathToMatch.split("/").slice(0, 2).join("/")

  if (exact) {
    return normalizedUrlPathname === normalizedPathToMatch
  }

  return normalizedUrlPathname.startsWith(basePath)
}

export function createWorkspaceUrl(
  orgSlug: string,
  href: string,
  queryParams?: Record<string, string>
) {
  const query = queryParams
    ? `?${new URLSearchParams(queryParams).toString()}`
    : ""
  const path = href.startsWith("/") ? href : `/${href}`
  return `${DEFAULT_ROUTE_PATH}/${orgSlug}${path}${query}`
}
