"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  createWorkspaceUrl as _createWorkspaceUrl,
  DEFAULT_ROUTE_PATH
} from "#/core/config/routes"
import { useApp } from "#/core/context/AppContext"

export function useWorkspaceRouter() {
  const { orgSlug } = useApp()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createWorkspaceUrl = (
    path: string,
    queryParams?: Record<string, string>
  ) => {
    return _createWorkspaceUrl(orgSlug, path, queryParams)
  }

  const getBetaPrefix = () => {
    return pathname.includes("/beta_/") ? "beta_/" : ""
  }

  const workspacePush = (
    path: string,
    newSearchParams?: Record<string, string>,
    keepSearchParams = false
  ) => {
    const currentSearchParams = searchParams.toString()
    let query = ""

    if (newSearchParams) {
      query = `?${new URLSearchParams(newSearchParams).toString()}`
      if (keepSearchParams && currentSearchParams) {
        query += `&${currentSearchParams}`
      }
    } else if (keepSearchParams && currentSearchParams) {
      query = `?${currentSearchParams}`
    }

    const betaPrefix = getBetaPrefix()
    router.push(`${DEFAULT_ROUTE_PATH}/${orgSlug}/${betaPrefix}${path}${query}`)
  }

  const workspaceReplace = (
    path: string,
    newSearchParams?: Record<string, string>,
    keepSearchParams = false
  ) => {
    const currentSearchParams = searchParams.toString()
    let query = ""

    if (newSearchParams) {
      query = `?${new URLSearchParams(newSearchParams).toString()}`
      if (keepSearchParams && currentSearchParams) {
        query += `&${currentSearchParams}`
      }
    } else if (keepSearchParams && currentSearchParams) {
      query = `?${currentSearchParams}`
    }

    const betaPrefix = getBetaPrefix()
    router.replace(
      `${DEFAULT_ROUTE_PATH}/${orgSlug}/${betaPrefix}${path}${query}`
    )
  }

  return {
    router,
    pathname,
    searchParams,
    workspacePush,
    workspaceReplace,
    createWorkspaceUrl
  }
}
